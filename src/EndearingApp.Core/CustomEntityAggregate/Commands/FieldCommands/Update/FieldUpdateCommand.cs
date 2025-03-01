using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Update;
public class FieldUpdateCommand(Field Field) : IRequest<Result<Field>>
{
    public Field Field { get; } = Field;
}
