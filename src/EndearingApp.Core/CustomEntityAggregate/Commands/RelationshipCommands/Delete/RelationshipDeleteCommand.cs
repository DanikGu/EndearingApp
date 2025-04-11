using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.RelationshipCommands.Delete;

public class RelationshipDeleteCommand(Guid id): IRequest<Result>
{
    public Guid RelationshipId { get; set; } = id;
}
