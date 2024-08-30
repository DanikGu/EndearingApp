using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EndearingApp.Core.CustomDataAccsess.Interfaces;
public interface ICustomDataEditor
{
    object Update(string tableName, string key, string updatedEntity);
    object Patch(string tableName, string key, string updatedFields);
    object Create(string tableName, string jsonEntity);
    void Delete(string tableName, string key);
}
