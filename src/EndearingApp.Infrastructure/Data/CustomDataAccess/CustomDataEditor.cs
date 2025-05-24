using System.Reflection;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using Newtonsoft.Json;
using System.Collections;
using System.Linq;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;
public class CustomDataEditor : ICustomDataEditor
{
    private readonly ICustomEntityQueryProvider _customEntityQueryProvider;

    public CustomDataEditor(ICustomEntityQueryProvider customEntityQueryProvider)
    {
        _customEntityQueryProvider = customEntityQueryProvider;
    }

    public object Create(string tableName, string jsonEntity)
    {
        var dbContext = _customEntityQueryProvider.GetDbContext();
        var dbSet = _customEntityQueryProvider.GetDbSet(tableName);
        var modelType = Utils.GetTableModelType(dbSet);
        var entity = JsonConvert.DeserializeObject(jsonEntity, modelType, new JsonSerializerSettings()
        {
            DateTimeZoneHandling = DateTimeZoneHandling.Utc
        });
        if (entity is null)
        {
            throw new ArgumentException($"Cannot parse entity {modelType.Name} from inputJson");
        }
        var keyProp = Utils.GetKeyProp(modelType, dbContext).PropertyInfo;
        if (keyProp is not null && keyProp.PropertyType == typeof(Guid))
        {
            if (keyProp.GetValue(entity) is not null && (keyProp.GetValue(entity) as Guid?) != Guid.Empty)
            {
                throw new ArgumentException("Cannot create entity with predefined Key");
            }
            keyProp.SetValue(entity, Guid.CreateVersion7());
        }
        dbContext.Add(entity!);
        dbContext.SaveChanges();
        return entity!;
    }

    public void Delete(string tableName, string key)
    {
        var dbContext = _customEntityQueryProvider.GetDbContext();
        var query = _customEntityQueryProvider.GetByKey(tableName, key);
        var etn = Utils.InvokeSingleOrDefaultMethod(query, Utils.GetTableModelType(query));
        if (etn is null)
        {
            throw new ArgumentException($"Entity with name {tableName} and key {key} wasn't found");
        }
        dbContext.Remove(etn!);
        dbContext.SaveChanges();
    }

    public object Patch(string tableName, string key, string jsonChangedValues)
    {
        var dbContext = _customEntityQueryProvider.GetDbContext();
        var query = _customEntityQueryProvider.GetByKey(tableName, key);
        var modelType = Utils.GetTableModelType(query);
        var etn = Utils.InvokeSingleOrDefaultMethod(query, Utils.GetTableModelType(query));
        if (etn is null)
        {
            throw new ArgumentException($"Entity with name {tableName} and key {key} wasn't found");
        }
        var deltaObj = JsonConvert.DeserializeObject<Dictionary<string, object>>(
            jsonChangedValues, 
            new JsonSerializerSettings()
            {
                DateTimeZoneHandling = DateTimeZoneHandling.Utc
            }
        );
        ApplyPatch(etn, deltaObj!);
        dbContext.Update(etn!);
        dbContext.SaveChanges();
        return etn;
    }

    public object Update(string tableName, string key, string updatedEntity)
    {
        var dbContext = _customEntityQueryProvider.GetDbContext();
        var query = _customEntityQueryProvider.GetByKey(tableName, key);
        var modelType = Utils.GetTableModelType(query);
        var etn = Utils.InvokeSingleOrDefaultMethod(query, Utils.GetTableModelType(query));
        if (etn is null)
        {
            throw new ArgumentException($"Entity with name {tableName} and key {key} wasn't found");
        }
        var newEtn = JsonConvert.DeserializeObject(updatedEntity, modelType, new JsonSerializerSettings()
        {
            DateTimeZoneHandling = DateTimeZoneHandling.Utc
        });
        var keyProp = Utils.GetKeyProp(modelType, dbContext);
        keyProp.PropertyInfo!.SetValue(newEtn, Utils.ConvertToKeyType(key, keyProp.ClrType));
        dbContext.Update(newEtn!);
        dbContext.SaveChanges();
        return etn;
    }
    public static void ApplyPatch(object entity, Dictionary<string, object> delta)
    {
        if (entity == null)
            throw new ArgumentNullException(nameof(entity));

        if (delta == null || !delta.Any())
            return;

        Type entityType = entity.GetType();
        foreach (var entry in delta)
        {
            PropertyInfo? property = entityType.GetProperty(entry.Key, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
            if (property == null || !property.CanWrite)
                continue;

            object? value = ConvertValue(property.PropertyType, entry.Value);
            property.SetValue(entity, value);
        }
    }

    private static object? ConvertValue(Type targetType, object value)
    {
        if (value == null)
            return null;

        if (targetType.IsAssignableFrom(value.GetType()))
        {
            if (targetType == typeof(DateTime) && value is not null)
            {
                value = ((DateTime)value).ToUniversalTime();
            }
            return value;
        }
        targetType =
            targetType.IsGenericType
            && targetType.GetGenericTypeDefinition() == typeof(Nullable<>)
                ? Nullable.GetUnderlyingType(targetType)!
                : targetType!;
        try
        {

            if (targetType == typeof(Guid) && value.GetType() == typeof(string))
            {
                value = new Guid((string)value);
            }
            else if (targetType!.IsEnum)
            {
                value = Enum.ToObject(targetType, value);
            }
            else if (targetType == typeof(DateTime) && value.GetType() == typeof(string))
            {
                if (DateTime.TryParse((string)value, out DateTime date))
                {
                    if (date.Kind != DateTimeKind.Utc)
                    {
                        date = DateTime.SpecifyKind(date, DateTimeKind.Utc);
                    }
                    value = date;
                }
            }
            else if (targetType == typeof(DateOnly) && value.GetType() == typeof(string))
            {
                if (DateOnly.TryParse((string)value, out DateOnly date))
                {
                    value = date;
                }
            }
            else if (targetType == typeof(TimeOnly) && value.GetType() == typeof(string))
            {
                if (TimeOnly.TryParse((string)value, out TimeOnly time))
                {
                    value = time;
                }
            }
            else if (1 == 1
                && typeof(IEnumerable).IsAssignableFrom(value.GetType()) 
                && targetType.IsArray 
                && targetType.GetElementType() is not null) 
            {
                
                var elementType = targetType.GetElementType();
                var list = Activator.CreateInstance(typeof(List<>).MakeGenericType(elementType));
                foreach (var item in (IEnumerable)value)
                {
                    var listValue = ConvertValue(elementType!, item);
                    if (listValue is not null)
                        (list as IList).Add(listValue);
                }
                value = Utils.CallMethodByName(list, "ToArray", new object[0]);
            }
            else
            {
                value = Convert.ChangeType(value, targetType);
            }

            return value;
        }
        catch
        {
            return null;
        }
    }
}
