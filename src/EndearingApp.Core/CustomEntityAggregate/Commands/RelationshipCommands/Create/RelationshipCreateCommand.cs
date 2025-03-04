using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.RelationshipCommands.Create;

public class RelationshipCreateCommand(Relationship relationship) : IRequest<Result<Relationship>>
{
    public Relationship Relationship { get; } = relationship;
}
