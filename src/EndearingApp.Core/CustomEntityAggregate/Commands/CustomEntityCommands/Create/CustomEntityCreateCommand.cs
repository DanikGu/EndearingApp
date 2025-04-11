using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Create;

public class CustomEntityCreateCommand(CustomEntity customEntity) : IRequest<Result<CustomEntity>>
{
    public CustomEntity CustomEntity { get; } = customEntity;
}
