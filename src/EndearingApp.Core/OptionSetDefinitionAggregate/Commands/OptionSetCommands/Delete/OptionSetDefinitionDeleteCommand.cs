using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Delete;

public class OptionSetDefinitionDeleteCommand(Guid id): IRequest<Result>
{
    public Guid Id { get; set; } = id;
}
