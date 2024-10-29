using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.SharedKernel;

namespace EndearingApp.Core.CustomEntityAggregate;
public class FormMetadata: EntityBase
{
    [ForeignKey("CustomEntity")]
    public Guid CustomEntityId { get; set; }
    [DataMember]
    public required CustomEntity CustomEntity { get; set; }
    [DataMember]
    public string DisplayName { get; set; } = string.Empty;
    [DataMember]
    public string Description { get; set; } = string.Empty;
    [DataMember]
    public string Metadata { get; set; } = string.Empty;
}
