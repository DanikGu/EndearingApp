using EndearingApp.SharedKernel;
using EndearingApp.SharedKernel.Interfaces;

namespace EndearingApp.Core.OptionSetDefinitionAggregate;

public class OptionSetDefinition: EntityBase, IAggregateRoot 
{
    public string Name { get; set; } = string.Empty;

    public List<Option> Options = new List<Option>();
    public bool IsGlobal { get; set; }

    public void UpdateOptionSetDefinition(OptionSetDefinition optionSetDefinition) 
    {
        Name = optionSetDefinition.Name;
        Options = optionSetDefinition.Options;
        IsGlobal = optionSetDefinition.IsGlobal;
    }
}
