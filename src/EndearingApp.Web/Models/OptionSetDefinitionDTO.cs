using System.Runtime.Serialization;
using EndearingApp.Core.CustomEntityAggregate;

namespace EndearingApp.Web.Models;

public class OptionSetDefinitionDTO: BaseDto<OptionSetDefinitionDTO, OptionSetDefinition>
{
    public Guid Id { get; set; }

    public List<OptionDTO> Options = new();
    public bool IsGlobal { get; set; }
}
public class OptionDTO
{
    public Guid Id { get; set; }
    public int Value { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

}
