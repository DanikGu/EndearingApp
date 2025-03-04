using FluentValidation;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.RelationshipCommands.Delete;

public class RelationshipDeleteCommandValidator : AbstractValidator<RelationshipDeleteCommand>
{
    public RelationshipDeleteCommandValidator()
    {
        RuleFor(x => x.RelationshipId)
            .NotEmpty().WithMessage("Id is required for delete");
    }
}
