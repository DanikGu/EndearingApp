using FluentValidation;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Delete;

public class OptionSetDefinitionDeleteCommandValidator : AbstractValidator<OptionSetDefinitionDeleteCommand>
{
    public OptionSetDefinitionDeleteCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Id is required for delete");
    }
}
