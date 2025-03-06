using Ardalis.Result;
using EndearingApp.Core.Exstensions;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Delete;

public class OptionSetDefinitionDeleteHandler : IRequestHandler<OptionSetDefinitionDeleteCommand, Result>
{
    private readonly ILogger<OptionSetDefinitionDeleteHandler> _logger;
    private readonly IRepository<OptionSetDefinition> _optionSetDefinitionRepository;
    private readonly IValidator<OptionSetDefinitionDeleteCommand> _validator;

    public OptionSetDefinitionDeleteHandler(
        ILogger<OptionSetDefinitionDeleteHandler> logger,
        IRepository<OptionSetDefinition> optionSetDefinitionRepository,
        IValidator<OptionSetDefinitionDeleteCommand> validator)
    {
        _logger = logger;
        _optionSetDefinitionRepository = optionSetDefinitionRepository;
        _validator = validator;
    }

    public async Task<Result> Handle(OptionSetDefinitionDeleteCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result.Invalid(validationResult.Errors.ToValidationError());
        }

        var existingEntity = await _optionSetDefinitionRepository.GetByIdAsync(command.Id, cancellationToken);
        if (existingEntity == null)
        {
            return Result.NotFound();
        }

        try
        {
            await _optionSetDefinitionRepository.DeleteAsync(existingEntity, cancellationToken);
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting the custom entity");
            return Result.Error("Unhandled exception occurred, please try again later");
        }
    }
}
