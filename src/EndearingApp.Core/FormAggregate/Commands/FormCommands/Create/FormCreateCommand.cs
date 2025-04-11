using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.FormAggregate.Commands.FormCommands.Create;

public class FormCreateCommand(Form form) : IRequest<Result<Form>>
{
    public Form Form { get; } = form;
}
