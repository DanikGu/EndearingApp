using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.FormAggregate.Commands.FormCommands.Delete;

public class FormDeleteCommand(Guid id): IRequest<Result>
{
    public Guid Id { get; set; } = id;
}
