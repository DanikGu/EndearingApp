using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.Loader;
using System.Text;
using System.Threading.Tasks;
using EndearingApp.Core.CustomEntityAggregate.Events;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;

public class DbContextAssemblyLoader
{
    private static Type? _dbContextType = null;
    private static AssemblyLoadContext? _loadContext;
    private readonly ILogger<DbContextAssemblyLoader> _logger;

    public DbContextAssemblyLoader(ILogger<DbContextAssemblyLoader> logger)
    {
        _logger = logger;
    }

    public Type GetDbContextType()
    {
        EnsureAssemblyLoaded();
        return _dbContextType!;
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

    public void EnsureAssemblyLoaded()
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
        _logger.LogInformation(path);
        var files = Directory.GetFiles(path, projectName + ".dll", SearchOption.AllDirectories);
        _logger.LogInformation(JsonConvert.SerializeObject(files));
        if (files.Length == 0)
        {
            throw new InvalidOperationException("Db Context Assenvly does not exists");
        }
        var assemblyFile = files.First(x => x.Contains("publish"));
        var directory = Path.GetDirectoryName(assemblyFile);
        var dlls = Directory.GetFiles(directory!, "*.dll", SearchOption.AllDirectories);
        _loadContext = new AssemblyLoadContext("DbContextAssembly", true);
        var deaultContext = AssemblyLoadContext.Default;
        var memStream = new MemoryStream(File.ReadAllBytes(assemblyFile));
        var dbContextAssembly = _loadContext.LoadFromStream(memStream);
        var references = dbContextAssembly.GetReferencedAssemblies();
        foreach (var refAss in references)
        {
            if (deaultContext.Assemblies.Any(x => x.GetName().FullName == refAss.FullName))
            {
                var refAssemb = deaultContext.Assemblies.First(x =>
                    x.GetName().FullName == refAss.FullName
                );
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
