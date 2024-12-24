using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using EndearingApp.SharedKernel;

namespace EndearingApp.Core.CustomEntityAggregate;

public class OptionSetDefinition : EntityBase
{
    public string Name { get; set; } = string.Empty;

    public List<Option> Options = new List<Option>();
    public bool IsGlobal { get; set; }
}
