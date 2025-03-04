using FluentValidation;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Update;

public class RelationshipUpdateCommandValidator : AbstractValidator<FieldUpdateCommand>
{
    public RelationshipUpdateCommandValidator()
    {
        RuleFor(x => x.Field.Id)
            .NotEmpty().WithMessage("Id is required for update");

        RuleFor(x => x.Field.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

        RuleFor(x => x.Field.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters");
        RuleFor(x => x.Field.IsSystemField)
            .Equal(false).WithMessage("System field cannot be updated");
    }
}
