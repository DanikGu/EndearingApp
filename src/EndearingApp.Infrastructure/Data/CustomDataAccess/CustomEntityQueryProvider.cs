﻿using System.Linq.Expressions;
using System.Reflection;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;
public class CustomEntityQueryProvider : ICustomEntityQueryProvider
{
    private readonly DbContextAssemblyLoader _contextAssemblyLoader;

    public CustomEntityQueryProvider(DbContextAssemblyLoader contextAssemblyLoader)
    {
        _contextAssemblyLoader = contextAssemblyLoader;
    }
   
    public DbContext GetDbContext()
    {
        var dbContextType = _contextAssemblyLoader.GetDbContextType();
        var dbContext = Activator.CreateInstance(dbContextType) as DbContext;
        return dbContext ??
            throw new InvalidOperationException("DbContext is not initialized or found");
    }
    public IQueryable GetDbSet(string entityName)
    {
        var dbContext = GetDbContext();
        return GetDbSet(entityName, (DbContext)dbContext!);
    }
    public IQueryable GetByKey(string entityName, string key)
    {
        var dbContext = GetDbContext();
        var dbSet = GetDbSet(entityName, dbContext)!;
        var modelType = Utils.GetTableModelType(dbSet);
        var keyProp = Utils.GetKeyProp(modelType, dbContext);
        

        var query = ApplyWhereFieldEqual(
            dbSet,
            keyProp.PropertyInfo!.Name,
            Utils.ConvertToKeyType(key, keyProp.PropertyInfo!.PropertyType));

        return query;
    }
    
    
    private IQueryable ApplyWhereFieldEqual(IQueryable dbSet, string fieldName, object value) 
    {
        var modelType = Utils.GetTableModelType(dbSet);
        ParameterExpression pe = Expression.Parameter(modelType, "x");
        MemberExpression member = Expression.Property(pe, fieldName);
        Expression valueExpression = Expression.Constant(value);
        Expression equalityExpression = Expression.Equal(member, valueExpression);
        var lambdaType = Expression.GetFuncType(modelType, typeof(bool));
        var lambda = Expression.Lambda(lambdaType, equalityExpression, pe);
        var result = InvokeWhereMethod(dbSet, lambda, modelType);
        return (IQueryable)result!;
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
    
    private IQueryable GetDbSet(string entityName, DbContext dbContext)
    {
        var dbSet = Utils.GetPropValue<IQueryable>(dbContext, entityName);
        return dbSet ?? throw new ArgumentNullException("Table not found");
    }
    
    private IQueryable IncludeAllFirstLevelProps(DbContext dbContext, IQueryable dbSet)
    {
        var modelType = Utils.GetTableModelType(dbSet);
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
   
    
    private IQueryable IncludeField(IQueryable dbSet, string fieldName)
    {
        var modelType = Utils.GetTableModelType(dbSet);

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
    
    
    
}