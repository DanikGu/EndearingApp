using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using EndearingApp.SharedKernel;

namespace EndearingApp.Core.CustomEntityAggregate;
public class Option: EntityBase
{
    [DataMember]
    public int Value { get; set; }
    [DataMember]
    public string DisplayName { get; set; } = string.Empty;
    [DataMember]
    public string Name { get; set; } = string.Empty;
    [DataMember]
    public string Description { get; set; } = string.Empty;
    public Guid OptionSetId { get; set; }
    public OptionSetDefinition OptionSet { get; set; } = new OptionSetDefinition();
}
