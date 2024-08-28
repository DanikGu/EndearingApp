using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.Loader;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomEntityAggregate.Events;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;
//TODO: Move assembly loading to separate dependeciy
public class CustomEntityDataProvider : ICustomEntityDataProvider
{
    private static Type? _dbContextType = null;
    private static AssemblyLoadContext? _loadContext;
    private readonly IMediator _mediator;

    public CustomEntityDataProvider(IMediator mediator)
    {
        _mediator = mediator;
    }
    public void FreePreviousAssembly() 
    {
        try
        {
            if (_loadContext is not null)
            {
                _loadContext.Unload();
                _loadContext = null;
                _dbContextType = null;

                GC.Collect();
                GC.WaitForPendingFinalizers();
            }
        }
        catch (Exception ex) 
        {
            Debug.WriteLine(ex.Message);
        }
    }
    public void ReloadDbContextAsseblies() 
    {
        LoadDbContextAssembly();
    }
    public DbContext GetDbContext()
    {
        EnsureAssemblyLoaded();
        var dbContext = Activator.CreateInstance(_dbContextType!) as DbContext;
        return dbContext ??
            throw new InvalidOperationException("DbContext is not initialized or found");
    }
    public IQueryable GetDbSet(string entityName)
    {
        EnsureAssemblyLoaded();
        var dbContext = GetDbContext();
        return GetDbSet(entityName, (DbContext)dbContext!);
    }
    public object? GetByKey(string entityName, string key)
    {
        EnsureAssemblyLoaded();

        var dbContext = GetDbContext();
        var dbSet = GetDbSet(entityName, dbContext)!;
        var modelType = dbSet.GetType().GenericTypeArguments[0];
        var keyProp = GetKeyProp(modelType, dbContext);
        

        var query = ApplyWhereFieldEqual(
            dbSet,
            keyProp.PropertyInfo!.Name,
            ConvertToKeyType(key, keyProp.PropertyInfo!.PropertyType));
        query = IncludeAllFirstLevelProps(dbContext, query);
        var result = InvokeSingleOrDefaultMethod(query, modelType);

        return result;
    }
    private IQueryable IncludeAllFirstLevelProps(DbContext dbContext, IQueryable dbSet) 
    {
        var modelType = GetTableModelType(dbSet);
        var navigations = dbContext.Model
            .FindEntityType(modelType)!
            .GetDerivedTypesInclusive()
            .SelectMany(type => type.GetNavigations())
            .Distinct();
        foreach (var navigation in navigations) 
        {
            dbSet = IncludeField(dbSet, navigation.PropertyInfo!.Name);
        }
        return dbSet;
    }
    private Type GetTableModelType(IQueryable dbSet) 
    {
        return dbSet.GetType().GenericTypeArguments[0];
    }
    private IQueryable IncludeField(IQueryable dbSet, string fieldName) 
    {
        var modelType = GetTableModelType(dbSet);

        var parameter = Expression.Parameter(modelType, "e");
        var property = modelType.GetProperty(fieldName, BindingFlags.Public | BindingFlags.Instance);

        if (property is null) 
        {
            throw new ArgumentException($"Property {fieldName}, " +
                $"does not exists on type: {modelType.Name}");
        }

        var propertyAccess = Expression.MakeMemberAccess(parameter, property!);
        var lambda = Expression.Lambda(propertyAccess, parameter);
        var includeMethod = typeof(EntityFrameworkQueryableExtensions)
            .GetMethods(BindingFlags.Static | BindingFlags.Public)
            .FirstOrDefault(m => m.Name == "Include" && m.GetParameters().Length == 2)?
            .MakeGenericMethod(modelType, property!.PropertyType);

        return (IQueryable)includeMethod?.Invoke(dbSet, new object[] { dbSet, lambda })!;
    }
    private IQueryable ApplyWhereFieldEqual(IQueryable dbSet, string fieldName, object value) 
    {
        var modelType = GetTableModelType(dbSet);
        ParameterExpression pe = Expression.Parameter(modelType, "x");
        MemberExpression member = Expression.Property(pe, fieldName);
        Expression valueExpression = Expression.Constant(value);
        Expression equalityExpression = Expression.Equal(member, valueExpression);
        var lambdaType = Expression.GetFuncType(modelType, typeof(bool));
        var lambda = Expression.Lambda(lambdaType, equalityExpression, pe);
        var result = InvokeWhereMethod(dbSet, lambda, modelType);
        return (IQueryable)result!;
    }
    private object ConvertToKeyType(string key, Type keyType) 
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
    private object? InvokeSingleOrDefaultMethod(object obj, Type modelType)
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
    private object? InvokeWhereMethod(object obj, Expression predicate, Type modelType) 
    {
        var whereMethods = typeof(System.Linq.Queryable)
                .GetMethods(BindingFlags.Static | BindingFlags.Public)
                .Where(mi => mi.Name == "Where");


        MethodInfo? whereMethod = null;
        foreach (var methodInfo in whereMethods)
        {
            var count = methodInfo.GetParameters()[1].
                ParameterType.GetGenericArguments()[0].GetGenericArguments().Count();
            if (count == 2)
            {
                whereMethod = methodInfo;
            }
        }

        
        whereMethod = whereMethod!.MakeGenericMethod(modelType);

        var ret = whereMethod.Invoke(obj, new object[] { obj, predicate });
        return ret;
    }
    private object? CallMethodByName(object obj, string methodName, object[] parameters)
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
    private IQueryable GetDbSet(string entityName, DbContext dbContext)
    {
        var dbSet = GetPropValue<IQueryable>(dbContext, entityName);
        return dbSet ?? throw new ArgumentNullException("Table not found");
    }
    private IProperty GetKeyProp(Type modelType, DbContext dbContext)
    {
        var keyProp= dbContext.Model.FindEntityType(modelType)?
            .FindPrimaryKey()?
            .Properties
            .Single();

        return keyProp ?? 
            throw new ArgumentException($"Key proprty wasn't found on type: {modelType.FullName}");
    }
    
    private T? GetPropValue<T>(object src, string propName)
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
    private void EnsureAssemblyLoaded()
    {
        if (_loadContext is not null)
        {
            return;
        }
        LoadDbContextAssembly();
    }
    private void LoadDbContextAssembly()
    {
        var projectName = "CustomEntitiesDbContext";
        var dbContextName = "AppDbContext";
        var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, projectName);
        if (!Directory.Exists(path)) 
        {
            _mediator.Publish(new CustomDbStructureChangedEvent());
        }
        var files = Directory.
            GetFiles(path, projectName + ".dll", SearchOption.AllDirectories);
        if (files.Length == 0)
        {
            throw new InvalidOperationException("Db Context Assenvly does not exists");
        }
        var assemblyFile = files.First(x => x.Contains("publish"));
        var directory = Path.GetDirectoryName(assemblyFile);
        var dlls = Directory.
            GetFiles(directory!, "*.dll", SearchOption.AllDirectories);
        _loadContext = new AssemblyLoadContext("DbContextAssembly", true);
        var deaultContext = AssemblyLoadContext.Default;
        var memStream = new MemoryStream(File.ReadAllBytes(assemblyFile));
        var dbContextAssembly = _loadContext.LoadFromStream(memStream);
        var references = dbContextAssembly.GetReferencedAssemblies();
        foreach (var refAss in references)
        {
            if (deaultContext.Assemblies.Any(x => x.GetName().FullName == refAss.FullName))
            {
                var refAssemb = deaultContext.Assemblies.First(x => x.GetName().FullName == refAss.FullName);
                _loadContext.LoadFromAssemblyName(refAss);
            }
            else
            {
                var dll = dlls.FirstOrDefault(x => refAss.Name + ".dll" == x.Split("\\").Last());
                if (dll != null)
                {
                    var dllMemStream = new MemoryStream(File.ReadAllBytes(dll));
                    _loadContext.LoadFromStream(dllMemStream);
                }
            }
        }
        var assembly = _loadContext.Assemblies.Where(x => x.GetName().Name == projectName).First();
        _dbContextType = assembly.GetType(projectName + "." + dbContextName);
    }
}
