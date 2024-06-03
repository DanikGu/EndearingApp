using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EndearingApp.SharedKernel.Interfaces;

public interface ISqlExecutor
{
    Task<int> Execute(string sql);
    Task<int> Execute(DbCommand dbCommand);
    Task<int> Execute(string sql, params object[] parameters);
    Task<IEnumerable<T>> List<T>(string sql);

    Task<IEnumerable<T>> List<T>(DbCommand dbCommand);
    Task<IDbTransaction> BeginTransaction();
}
