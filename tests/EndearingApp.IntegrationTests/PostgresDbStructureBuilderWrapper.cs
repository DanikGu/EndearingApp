using System;
using System.Data;
using Microsoft.EntityFrameworkCore;
using SqlForSchemaGenerator.Core.Interfaces;
using SqlForSchemaGenerator.Core.Models;
using SqlForSchemaGenrator.Postgres;

namespace EndearingApp.Infrastructure.Data;

public class PostgresDbStructureBuilderWrapper : IDbStructureBuilder, IDisposable
{
    private PostgresDbStructureBuilder _dbStructureBuilder;
    private bool _isDisposed = false;
    private IDbConnection _connnection;

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

    public DbStructure Build()
    {
        return _dbStructureBuilder.Build();
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
