using FluentValidation;

namespace EndearingApp.Core.FormAggregate.Commands.FormCommands.Delete;

public class FormDeleteCommandValidator : AbstractValidator<FormDeleteCommand>
{
    public FormDeleteCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required for delete");
    }
}
