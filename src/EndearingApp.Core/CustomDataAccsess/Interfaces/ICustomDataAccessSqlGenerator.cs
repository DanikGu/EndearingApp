using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EndearingApp.Core.CustomDataAccsess.Interfaces;

public interface ICustomDataAccessSqlGenerator
{
    DbCommand GetSqlQuery(Uri relativeUrl);
    DbCommand GetCreateSql(string tableName, Dictionary<string, object> values);
    DbCommand GetUpdateSql<T>(
        string tableName,
        string keyName,
        T id,
        Dictionary<string, object> values
    );
    DbCommand GetDeleteSql<T>(string tableName, string keyName, T id);
}
