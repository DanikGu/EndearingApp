using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomEntityAggregate.Events;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;
public class CustomEntityDataProvider : ICustomEntityQueryDataProvider
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
    public DbContext GetDbContext(string entityName)
    {
        EnsureAssemblyLoaded();
        var dbContext = Activator.CreateInstance(_dbContextType!) as DbContext;
        return dbContext ??
            throw new InvalidOperationException("DbContext is not initialized or found");
    }
    public IQueryable GetDbSet(string entityName)
    {
        EnsureAssemblyLoaded();
        var dbContext = Activator.CreateInstance(_dbContextType!) ?? 
            throw new InvalidOperationException("Cannot activate dbContext");
        var dbSet = GetPropValue<IQueryable>(dbContext, entityName);
        return dbSet ?? throw new ArgumentNullException("Table not found");
    }
    private T? GetPropValue<T>(object src, string propName)
    {
        var value = src?.GetType()?.GetProperty(propName)?.GetValue(src, null);
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
