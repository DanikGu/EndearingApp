
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace EndearingApp.Core.CustomDataAccsess.Interfaces;
public interface ICustomEntityQueryProvider
{
    DbContext GetDbContext();
    IQueryable GetDbSet(string entityName);
    IQueryable GetByKey(string entityName, string key);
}
