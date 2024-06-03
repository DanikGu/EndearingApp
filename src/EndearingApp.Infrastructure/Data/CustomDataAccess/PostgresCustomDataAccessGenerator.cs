using System.Data.Common;
using Npgsql;
using OdataToSqlConvertor;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using SqlKata.Compilers;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;

public class PostgresCustomDataAccessGenerator : ICustomDataAccessSqlGenerator
{
    private ODataToSqlConverter _convertor;

    public PostgresCustomDataAccessGenerator(IEdmModelManager edmModelManager)
    {
        var compiler = new PostgresCompiler();
        _convertor = new ODataToSqlConverter(compiler, edmModelManager.GetModel());
    }

    public DbCommand GetCreateSql(string tableName, Dictionary<string, object> values)
    {
        tableName = PutStringInQuotes(tableName);
        var fieldNames = string.Join(",", values.Keys.Select(PutStringInQuotes).ToList());
        var fieldValues = string.Join(",", values.Keys.Select(x => "@param_" + x).ToList());
        var updateSql = $"INSERT INTO {tableName} ({fieldNames}) VALUES ({fieldValues});";
        var command = new NpgsqlCommand(updateSql);
        foreach (var item in values)
        {
            command.Parameters.AddWithValue("param_" + item.Key, item.Value);
        }

        return command;
    }

    public DbCommand GetDeleteSql<T>(string tableName, string keyName, T id)
    {
        tableName = PutStringInQuotes(tableName);
        keyName = PutStringInQuotes(keyName);
        var updateSql = $"DELETE FROM {tableName} Where {keyName} = @param_id";
        var command = new NpgsqlCommand(updateSql);
        command.Parameters.AddWithValue("@param_id", id!);
        return command;
    }

    public DbCommand GetSqlQuery(Uri relativeUrl)
    {
        var sql = _convertor.ConvertToSQL(relativeUrl);
        var command = new NpgsqlCommand(sql.Item1);
        foreach (var item in sql.Item2)
        {
            command.Parameters.AddWithValue(item.Key, item.Value);
        }
        return command;
    }

    public DbCommand GetUpdateSql<T>(
        string tableName,
        string keyName,
        T id,
        Dictionary<string, object> values
    )
    {
        tableName = PutStringInQuotes(tableName);
        keyName = PutStringInQuotes(keyName);
        var setStamenents = string.Join(
            ",",
            values.Select(x => $"{PutStringInQuotes(x.Key)} = @param_{x.Key}")
        );
        var sql = $"UPDATE {tableName} SET {setStamenents} WHERE {keyName} = @key_param;";
        var command = new NpgsqlCommand(sql);
        command.Parameters.AddWithValue("@key_param", id!);
        foreach (var item in values)
        {
            command.Parameters.AddWithValue("@param_" + item.Key, item.Value);
        }
        return command;
    }

    private string PutStringInQuotes(string value)
    {
        return "\"" + value + "\"";
    }
}
