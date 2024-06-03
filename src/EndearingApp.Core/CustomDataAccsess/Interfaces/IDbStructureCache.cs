using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SqlForSchemaGenerator.Core.Models;

namespace EndearingApp.Core.CustomDataAccsess.Interfaces;

public interface IDbStructureCache
{
    DbStructure Get();
}
