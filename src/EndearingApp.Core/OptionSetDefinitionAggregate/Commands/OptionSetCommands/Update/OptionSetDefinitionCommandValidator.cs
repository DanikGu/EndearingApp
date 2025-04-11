using FluentValidation;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Update;
public class OptionSetDefinitionCommandValidator : AbstractValidator<OptionSetDefinitionUpdateCommand>
{
    public OptionSetDefinitionCommandValidator()
    {
        RuleFor(x => x.OptionSetDefinition.Id)
            .NotEmpty().WithMessage("Id is required for update");

        RuleFor(x => x.OptionSetDefinition.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");
    }
}
