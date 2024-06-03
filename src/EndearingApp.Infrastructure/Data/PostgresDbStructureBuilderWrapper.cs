using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using SqlForSchemaGenerator.Core.Interfaces;
using SqlForSchemaGenerator.Core.Models;
using SqlForSchemaGenrator.Postgres;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace EndearingApp.Infrastructure.Data;

public class PostgresDbStructureBuilderWrapper : IDbStructureBuilder, IDbStructureCache, IDisposable
{
    private PostgresDbStructureBuilder _dbStructureBuilder;
    private bool _isDisposed = false;
    private IDbConnection _connnection;
    private static DbStructure? _dbStructureCache = null;
    private static object _cacheLock = new object();

    public PostgresDbStructureBuilderWrapper(
        AppDbContext context,
        ISqlTypesConverter sqlTypesConverter
    )
    {
        _connnection = context.Database.GetDbConnection();
        if (_connnection.State != ConnectionState.Open)
            _connnection.Open();
        _dbStructureBuilder = new PostgresDbStructureBuilder(_connnection, sqlTypesConverter);
    }

    public DbStructure Get()
    {
        if (_dbStructureCache is null)
        {
            return Build();
        }
        lock (_cacheLock)
        {
            return _dbStructureCache;
        }
    }

    public DbStructure Build()
    {
        lock (_cacheLock)
        {
            _dbStructureCache = _dbStructureBuilder.Build();
            return _dbStructureCache;
        }
    }

    public void Dispose()
    {
        if (_isDisposed)
        {
            return;
        }
        _connnection?.Dispose();
        GC.SuppressFinalize(this);
    }

    ~PostgresDbStructureBuilderWrapper()
    {
        _connnection.Dispose();
    }
}
