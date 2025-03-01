using FluentValidation;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Update;

public class CustomEntityUpdateCommandValidator : AbstractValidator<CustomEntityUpdateCommand>
{
    public CustomEntityUpdateCommandValidator()
    {
        RuleFor(x => x.CustomEntity.Id)
            .NotEmpty().WithMessage("Id is required for update");

        RuleFor(x => x.CustomEntity.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

        RuleFor(x => x.CustomEntity.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters");
    }
}
