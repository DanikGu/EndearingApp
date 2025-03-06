using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Update;
public class OptionSetDefinitionUpdateCommand(OptionSetDefinition optionSetDefinition) : IRequest<Result<OptionSetDefinition>>
{
    public OptionSetDefinition OptionSetDefinition { get; } = optionSetDefinition;
}
