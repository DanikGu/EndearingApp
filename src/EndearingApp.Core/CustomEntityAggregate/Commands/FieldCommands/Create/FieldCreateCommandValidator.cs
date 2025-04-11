using FluentValidation;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Create;
public class RelationshipCreateCommandValidator : AbstractValidator<FieldCreateCommand>
{
    public RelationshipCreateCommandValidator()
    {
        RuleFor(x => x.Field.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

        RuleFor(x => x.Field.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters");
        RuleFor(x => x.Field.Type).IsInEnum().WithMessage("Type is requiered for field");
        RuleFor(x => x.Field.CustomEntityId)
            .NotEmpty().WithMessage("Custom Entity Id is required");
        RuleFor(x => x.Field.IsSystemField)
            .Equal(false).WithMessage("System field cannot be updated");
    }
}
