using FluentValidation;

namespace EndearingApp.Core.FormAggregate.Commands.FormCommands.Create;
public class FormCreateCommandValidator : AbstractValidator<FormCreateCommand>
{
    public FormCreateCommandValidator()
    {
        RuleFor(x => x.Form.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

        RuleFor(x => x.Form.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters");
    }
}
