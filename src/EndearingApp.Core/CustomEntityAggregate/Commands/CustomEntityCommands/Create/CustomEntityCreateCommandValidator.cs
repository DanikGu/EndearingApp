using FluentValidation;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Create;
public class CustomEntityCreateCommandValidator : AbstractValidator<CustomEntityCreateCommand>
{
    public CustomEntityCreateCommandValidator()
    {
        RuleFor(x => x.CustomEntity.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

        RuleFor(x => x.CustomEntity.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters");
    }
}
