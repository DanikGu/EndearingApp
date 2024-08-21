using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using Dapper;
using Microsoft.EntityFrameworkCore;
using EndearingApp.SharedKernel.Interfaces;

namespace EndearingApp.Infrastructure.Data;

public class DapperSqlExecutor : ISqlExecutor, IDisposable
{
    private readonly IDbConnection _connnection;
    private bool _isDisposed = false;

    public DapperSqlExecutor(AppDbContext dbContext)
    {
        _connnection = dbContext.Database.GetDbConnection();
        if (_connnection.State != ConnectionState.Open)
            _connnection.Open();
    }

    public async Task<int> Execute(DbCommand command)
    {
        command.Connection = (DbConnection)_connnection;
        var cmParams = (command.Parameters as IEnumerable<DbParameter>)!.ToDictionary(
            x => x.ParameterName,
            y => y.Value
        );
        var parameters = new DynamicParameters(cmParams);
        var result = await _connnection.ExecuteAsync(command.CommandText, parameters);
        return result;
    }

    public async Task<int> Execute(string sql)
    {
        var result = await _connnection.ExecuteAsync(sql);
        return result;
    }

    public async Task<int> Execute(string sql, params object[] parameters)
    {
        var result = await _connnection.ExecuteAsync(sql);
        return result;
    }

    public async Task<IEnumerable<T>> List<T>(string sql)
    {
        return await _connnection.QueryAsync<T>(sql);
    }

    public async Task<IEnumerable<T>> List<T>(DbCommand command)
    {
        command.Connection = (DbConnection)_connnection;
        var cmParams = (command.Parameters as IEnumerable<DbParameter>)!.ToDictionary(
            x => x.ParameterName,
            y => y.Value
        );
        var parameters = new DynamicParameters(cmParams);
        return await _connnection.QueryAsync<T>(command.CommandText, parameters);
    }

    public async Task<IDbTransaction> BeginTransaction()
    {
        await Task.CompletedTask;
        return _connnection.BeginTransaction();
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

    ~DapperSqlExecutor()
    {
        _connnection.Dispose();
    }
}
