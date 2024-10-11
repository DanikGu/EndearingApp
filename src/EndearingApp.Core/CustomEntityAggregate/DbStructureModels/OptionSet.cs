using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EndearingApp.Core.CustomEntityAggregate.DbStructureModels;
public class OptionSet
{
    public string Name { get; set; } = string.Empty;

    public List<Option> Options = new List<Option>();

}
