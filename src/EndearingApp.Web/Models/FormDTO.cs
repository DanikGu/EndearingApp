using EndearingApp.Core.CustomEntityAggregate;

namespace EndearingApp.Web.Models;

public class FormDTO
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string JsonSchema { get; set; } = "{}";
    public Guid CustomEntityId { get; set; } = Guid.Empty;
}
