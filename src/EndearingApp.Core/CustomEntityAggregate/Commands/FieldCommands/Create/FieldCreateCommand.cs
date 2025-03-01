using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Create;

public class FieldCreateCommand(Field field) : IRequest<Result<Field>>
{
    public Field Field { get; } = field;
}
