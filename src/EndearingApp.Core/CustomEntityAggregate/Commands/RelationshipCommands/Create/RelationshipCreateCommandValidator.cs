using FluentValidation;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.RelationshipCommands.Create;
public class RelationshipCreateCommandValidator : AbstractValidator<RelationshipCreateCommand>
{
    public RelationshipCreateCommandValidator()
    {
        RuleFor(x => x.Relationship.ConstraintName)
            .NotEmpty().WithMessage("ConstraintName is required")
            .MaximumLength(200).WithMessage("ConstraintName must not exceed 100 characters");

        RuleFor(x => x.Relationship.ReferencedFieldId)
            .NotEmpty()
            .WithMessage("ReferencedFieldId is required");

        RuleFor(x => x.Relationship.SourceFieldId)
            .NotEmpty()
            .WithMessage("SourceFieldId is required");
    }
}
