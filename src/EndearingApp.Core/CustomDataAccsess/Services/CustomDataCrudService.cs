using System.Data;
using System.Text;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.SharedKernel.Interfaces;
using SqlForSchemaGenerator.Core.Models;

namespace EndearingApp.Core.CustomDataAccsess.Services;

public class CustomDataCrudService
{
    private readonly ISqlExecutor _sqlExecutor;
    private readonly ICustomDataAccessSqlGenerator _customDataAccessSqlGenerator;
    private readonly IDbStructureCache _dbStructureCache;

    public CustomDataCrudService(
        ISqlExecutor sqlExecutor,
        ICustomDataAccessSqlGenerator customDataAccessSqlGenerator,
        IDbStructureCache dbStructureCache
    )
    {
        _sqlExecutor = sqlExecutor;
        _customDataAccessSqlGenerator = customDataAccessSqlGenerator;
        _dbStructureCache = dbStructureCache;
    }

    public async Task<bool> Create(string tableName, Dictionary<string, object> values)
    {
        IDbTransaction? transaction = default(IDbTransaction);
        try
        {
            ConvertTypesToTableTypes(tableName, values);
            transaction = await _sqlExecutor.BeginTransaction();
            var create = _customDataAccessSqlGenerator.GetCreateSql(tableName, values);
            int result = await _sqlExecutor.Execute(create);
            transaction.Commit();
            return result > 0;
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
            ConvertTypesToTableTypes(tableName, values);
            transaction = await _sqlExecutor.BeginTransaction();
            var update = _customDataAccessSqlGenerator.GetUpdateSql(tableName, keyName, id, values);
            int result = await _sqlExecutor.Execute(update);
            transaction.Commit();
            return result > 0;
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
            transaction = await _sqlExecutor.BeginTransaction();
            var delete = _customDataAccessSqlGenerator.GetDeleteSql(tableName, keyName, id);
            int result = await _sqlExecutor.Execute(delete);
            transaction.Commit();
            return result > 0;
        }
        catch
        {
            transaction?.Rollback();
            throw;
        }
    }

    public async Task<IEnumerable<T>> List<T>(Uri relativeUrl)
    {
        var command = _customDataAccessSqlGenerator.GetSqlQuery(relativeUrl);
        var result = await _sqlExecutor.List<T>(command);
        return result;
    }

    private void ConvertTypesToTableTypes(string tableName, Dictionary<string, object> values)
    {
        var dbStructure = _dbStructureCache.Get();
        var table = dbStructure.Tables.FirstOrDefault(x => x.Name.ToLower() == tableName.ToLower());
        if (table == null)
        {
            return;
        }
        var fields = table.Fields.ToDictionary(x => x.Name!, y => y);
        foreach (var fieldValues in values)
        {
            if (!fields.TryGetValue(fieldValues.Key, out Field? fieldDesc))
            {
                continue;
            }
            switch (fieldDesc.Type)
            {
                case SystemTypesEnum.Integer:
                    values[fieldValues.Key] = Convert.ToInt32(fieldValues.Value);
                    break;
                case SystemTypesEnum.SmallInteger:
                    values[fieldValues.Key] = Convert.ToInt16(fieldValues.Value);
                    break;
                case SystemTypesEnum.BigInteger:
                    values[fieldValues.Key] = Convert.ToInt64(fieldValues.Value);
                    break;
                case SystemTypesEnum.Decimal:
                    values[fieldValues.Key] = Convert.ToDecimal(fieldValues.Value);
                    break;
                case SystemTypesEnum.Real:
                    values[fieldValues.Key] = Convert.ToDouble(fieldValues.Value);
                    break;
                case SystemTypesEnum.Double:
                    values[fieldValues.Key] = Convert.ToDouble(fieldValues.Value);
                    break;
                case SystemTypesEnum.UnlimitedText:
                    values[fieldValues.Key] = Convert.ToString(fieldValues.Value)!;
                    break;
                case SystemTypesEnum.LimitedText:
                    values[fieldValues.Key] = Convert.ToString(fieldValues.Value)!;
                    break;
                case SystemTypesEnum.Date:
                    values[fieldValues.Key] = Convert.ToDateTime(fieldValues.Value);
                    break;
                case SystemTypesEnum.Time:
                    values[fieldValues.Key] = Convert.ToDateTime(fieldValues.Value);
                    break;
                case SystemTypesEnum.Timestamp:
                    values[fieldValues.Key] = Convert.ToDateTime(fieldValues.Value);
                    break;
                case SystemTypesEnum.Boolean:
                    values[fieldValues.Key] = Convert.ToBoolean(fieldValues.Value);
                    break;
                case SystemTypesEnum.Binary:
                    var base64String = Convert.ToString(fieldValues.Value);
                    values[fieldValues.Key] = base64String is null
                        ? null!
                        : Convert.FromBase64String(base64String!);
                    break;
                case SystemTypesEnum.UUID:
                    var str = Convert.ToString(fieldValues.Value) ?? Guid.Empty.ToString();
                    values[fieldValues.Key] = Guid.Parse(str);
                    break;
            }
        }
    }
}
