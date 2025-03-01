using FluentValidation;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Delete;

public class CustomEntityDeleteCommandValidator : AbstractValidator<CustomEntityDeleteCommand>
{
    public CustomEntityDeleteCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required for delete");
    }
}
