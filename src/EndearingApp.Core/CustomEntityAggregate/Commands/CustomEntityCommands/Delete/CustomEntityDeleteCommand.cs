using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Delete;

public class CustomEntityDeleteCommand(Guid id): IRequest<Result>
{
    public Guid Id { get; set; } = id;
}
