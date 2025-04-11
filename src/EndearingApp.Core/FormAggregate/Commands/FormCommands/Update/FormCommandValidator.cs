using FluentValidation;

namespace EndearingApp.Core.FormAggregate.Commands.FormCommands.Update;

public class FormCommandValidator : AbstractValidator<FormUpdateCommand>
{
    public FormCommandValidator()
    {
        RuleFor(x => x.Form.Id)
            .NotEmpty().WithMessage("Id is required for update");

        RuleFor(x => x.Form.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

        RuleFor(x => x.Form.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters");
    }
}
