using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

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
        var entity = JsonConvert.DeserializeObject(jsonEntity, modelType);
        if (entity is null) 
        {
            throw new ArgumentException($"Cannot parse entity {modelType.Name} from inputJson");
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
        var deltaType = typeof(Delta<>).MakeGenericType(modelType);
        var deltaObj = JsonConvert.
            DeserializeObject(jsonChangedValues, deltaType);
        Utils.CallMethodByName(deltaObj!, "Patch", new object[] { etn });
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
        var newEtn = JsonConvert.DeserializeObject(updatedEntity, modelType);
        var keyProp = Utils.GetKeyProp(modelType, dbContext);
        keyProp.PropertyInfo!.SetValue(newEtn, Utils.ConvertToKeyType(key, keyProp.ClrType));
        dbContext.Update(newEtn!);
        dbContext.SaveChanges();
        return etn;
    }
    
}
