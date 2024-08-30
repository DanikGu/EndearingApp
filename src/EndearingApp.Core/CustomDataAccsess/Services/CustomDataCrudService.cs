using System.Data;
using System.Globalization;
using System.Reflection;
using System.Text;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.SharedKernel.Interfaces;

namespace EndearingApp.Core.CustomDataAccsess.Services;

public class CustomDataCrudService
{
    private readonly ISqlExecutor _sqlExecutor;
    private readonly ICustomEntityQueryProvider _customEntityQueryableProvider;
    private readonly IEdmModelManager _edmModelManager;


    public CustomDataCrudService(
        ISqlExecutor sqlExecutor,
        ICustomEntityQueryProvider customEntityQueryableProvider,
        IEdmModelManager edmModelManager

    ) {
        _sqlExecutor = sqlExecutor;
        _customEntityQueryableProvider = customEntityQueryableProvider;
        _edmModelManager = edmModelManager;
    }

    public async Task<bool> Create(string tableName, Dictionary<string, object> values)
    {
        IDbTransaction? transaction = default(IDbTransaction);
        try
        {
            await Task.CompletedTask;
            //ConvertTypesToTableTypes(tableName, values);
            //transaction = await _sqlExecutor.BeginTransaction();
            //var create = _customDataAccessSqlGenerator.GetCreateSql(tableName, values);
            //int result = await _sqlExecutor.Execute(create);
            //transaction.Commit();
            return true;
        }
        catch
        {
            transaction?.Rollback();
            throw;
        }
    }

    public async Task<bool> Update<T>(
        string tableName,
        string keyName,
        T id,
        Dictionary<string, object> values
    )
    {
        IDbTransaction? transaction = default(IDbTransaction);
        try
        {
            await Task.CompletedTask;
            //ConvertTypesToTableTypes(tableName, values);
            //transaction = await _sqlExecutor.BeginTransaction();
            //var update = _customDataAccessSqlGenerator.GetUpdateSql(tableName, keyName, id, values);
            //int result = await _sqlExecutor.Execute(update);
            //transaction.Commit();
            return true;
        }
        catch
        {
            transaction?.Rollback();
            throw;
        }
    }

    public async Task<bool> Delete<T>(string tableName, string keyName, T id)
    {
        IDbTransaction? transaction = default(IDbTransaction);
        try
        {
            await Task.CompletedTask;
            //transaction = await _sqlExecutor.BeginTransaction();
            //var delete = _customDataAccessSqlGenerator.GetDeleteSql(tableName, keyName, id);
            //int result = await _sqlExecutor.Execute(delete);
            //transaction.Commit();
            return true;
        }
        catch
        {
            transaction?.Rollback();
            throw;
        }
    }
}

