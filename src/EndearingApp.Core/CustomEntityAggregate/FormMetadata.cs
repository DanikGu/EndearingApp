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

public class FormMetadata : EntityBase
{
    [ForeignKey("CustomEntity")]
    public Guid CustomEntityId { get; set; }
    public required CustomEntity CustomEntity { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Metadata { get; set; } = string.Empty;
}
