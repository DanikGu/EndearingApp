using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.RelationshipCommands.Update;
public class RelationshipUpdateCommand(Relationship relationship) : IRequest<Result<Relationship>>
{
    public Relationship Relationship { get; } = relationship;
}
