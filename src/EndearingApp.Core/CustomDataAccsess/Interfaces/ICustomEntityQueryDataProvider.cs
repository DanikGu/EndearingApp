
using Microsoft.EntityFrameworkCore;

namespace EndearingApp.Core.CustomDataAccsess.Interfaces;
public interface ICustomEntityQueryDataProvider
{
    DbContext GetDbContext(string entityName);
    IQueryable GetDbSet(string entityName);
    void ReloadDbContextAsseblies();
    void FreePreviousAssembly();
}
