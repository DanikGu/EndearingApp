using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;
public class Utils
{
    public static object? CallMethodByName(object obj, string methodName, object[] parameters)
    {
        Type type = obj.GetType();
        MethodInfo method = type.GetMethod(methodName,
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static)!;

        if (method == null)
        {
            throw new ArgumentException($"Method '{methodName}' not found in type '{type.FullName}'");
        }
        return method.Invoke(obj, parameters);
    }
    public static object ConvertToKeyType(string key, Type keyType)
    {
        if (keyType == typeof(Guid))
        {
            return new Guid(key);
        }
        else if (keyType == typeof(int))
        {
            return int.Parse(key);
        }
        else if (keyType == typeof(long))
        {
            return long.Parse(key);
        }
        else if (keyType == typeof(string))
        {
            return key;
        }
        throw new ArgumentException("Unsupported Key Type");
    }
    public static Type GetTableModelType(IQueryable dbSet)
    {
        return dbSet.GetType().GenericTypeArguments[0];
    }
    public static IProperty GetKeyProp(Type modelType, DbContext dbContext)
    {
        var keyProp = dbContext.Model.FindEntityType(modelType)?
            .FindPrimaryKey()?
            .Properties
            .Single();

        return keyProp ??
            throw new ArgumentException($"Key proprty wasn't found on type: {modelType.FullName}");
    }

    public static T? GetPropValue<T>(object src, string propName)
    {
        var prop = ((TypeInfo)(src?.GetType())!).
            DeclaredProperties.Where(x => x.Name == propName).FirstOrDefault();
        var value = prop?.GetValue(src);
        if (value is not null && value is T)
        {
            return (T)value;
        }
        else
        {
            return default(T?);
        }
    }
    public static object? InvokeSingleOrDefaultMethod(object obj, Type modelType)
    {
        var whereMethods = typeof(System.Linq.Queryable)
                .GetMethods(BindingFlags.Static | BindingFlags.Public)
                .Where(mi => mi.Name == "SingleOrDefault");


        MethodInfo? whereMethod = null;
        foreach (var methodInfo in whereMethods)
        {
            var count = methodInfo.GetParameters().Count();
            if (count == 1)
            {
                whereMethod = methodInfo;
            }
        }


        whereMethod = whereMethod!.MakeGenericMethod(modelType);

        var ret = whereMethod.Invoke(obj, new object[] { obj });
        return ret;
    }
}
