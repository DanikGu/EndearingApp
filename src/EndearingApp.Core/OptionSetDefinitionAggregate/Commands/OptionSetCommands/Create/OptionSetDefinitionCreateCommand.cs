using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Create;

public class OptionSetDefinitionCreateCommand(OptionSetDefinition OptionSetDefinition) : IRequest<Result<OptionSetDefinition>>
{
    public OptionSetDefinition OptionSetDefinition { get; } = OptionSetDefinition;
}
