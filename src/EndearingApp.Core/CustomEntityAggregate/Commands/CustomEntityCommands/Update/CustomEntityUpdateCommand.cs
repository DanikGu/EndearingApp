using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Update;
public class CustomEntityUpdateCommand(CustomEntity customEntity) : IRequest<Result<CustomEntity>>
{
    public CustomEntity CustomEntity { get; } = customEntity;
}
