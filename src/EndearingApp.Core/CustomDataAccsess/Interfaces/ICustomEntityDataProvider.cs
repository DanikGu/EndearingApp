
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace EndearingApp.Core.CustomDataAccsess.Interfaces;
public interface ICustomEntityDataProvider
{
    DbContext GetDbContext();
    IQueryable GetDbSet(string entityName);
    object? GetByKey(string entityName, string key);
    void ReloadDbContextAsseblies();
    void FreePreviousAssembly();
}
