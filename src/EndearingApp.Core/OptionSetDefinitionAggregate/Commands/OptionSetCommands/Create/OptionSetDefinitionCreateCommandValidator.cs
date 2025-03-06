using FluentValidation;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Create;
public class OptionSetDefinitionCreateCommandValidator : AbstractValidator<OptionSetDefinition>
{
    public OptionSetDefinitionCreateCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");
    }
}
