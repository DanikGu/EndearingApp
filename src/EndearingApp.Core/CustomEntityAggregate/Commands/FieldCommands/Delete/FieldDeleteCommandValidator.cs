using FluentValidation;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Delete;

public class FieldDeleteCommandValidator : AbstractValidator<FieldDeleteCommand>
{
    public FieldDeleteCommandValidator()
    {
        RuleFor(x => x.FieldId)
            .NotEmpty().WithMessage("Id is required for delete");
    }
}
