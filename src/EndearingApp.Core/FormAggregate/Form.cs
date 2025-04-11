using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.SharedKernel;
using EndearingApp.SharedKernel.Interfaces;

namespace EndearingApp.Core.FormAggregate;
public class Form: EntityBase, IAggregateRoot
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string JsonSchema { get; set; } = "{}";
    public Guid CustomEntityId { get; set; } = Guid.Empty;
    public CustomEntity CustomEntity { get; set; } = null!;
    
    public void UpdateForm(Form form)
    {
        Name = form.Name;
        Description = form.Description;
        JsonSchema = form.JsonSchema;
        CustomEntityId = form.CustomEntityId;
    }
}
