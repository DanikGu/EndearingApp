using Ardalis.Result;
using MediatR;

namespace EndearingApp.Core.FormAggregate.Commands.FormCommands.Update;
public class FormUpdateCommand(Form form) : IRequest<Result<Form>>
{
    public Form Form { get; } = form;
}
