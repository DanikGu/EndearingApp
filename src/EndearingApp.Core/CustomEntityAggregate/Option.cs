using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EndearingApp.SharedKernel;

namespace EndearingApp.Core.CustomEntityAggregate;
public class Option: EntityBase
{
    public int Value { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid OptionSetId { get; set; }
    public required OptionSetDefinition OptionSet { get; set; }
}
