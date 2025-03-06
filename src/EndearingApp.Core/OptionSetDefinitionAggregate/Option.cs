using EndearingApp.SharedKernel;

namespace EndearingApp.Core.OptionSetDefinitionAggregate;

public class Option : EntityBase
{
    public int Value { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid OptionSetId { get; set; }
    public OptionSetDefinition OptionSet { get; set; } = new OptionSetDefinition();
}
