using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Delete;

public class FieldDeleteCommand(Guid id): IRequest<Result>
{
    public Guid FieldId { get; set; } = id;
}
