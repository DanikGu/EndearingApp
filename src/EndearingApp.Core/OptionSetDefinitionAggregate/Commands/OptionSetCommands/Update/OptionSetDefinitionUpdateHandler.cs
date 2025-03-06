using Ardalis.Result;
using EndearingApp.Core.Exstensions;
using EndearingApp.Core.OptionSetDefinitionAggregate.Specifications;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Update;

public class OptionSetDefinitionUpdateHandler : IRequestHandler<OptionSetDefinitionUpdateCommand, Result<OptionSetDefinition>>
{
    private readonly ILogger<OptionSetDefinitionUpdateHandler> _logger;
    private readonly IRepository<OptionSetDefinition> _optionSetDefinitionRepository;
    private readonly IValidator<OptionSetDefinitionUpdateCommand> _validator;

    public OptionSetDefinitionUpdateHandler(
        ILogger<OptionSetDefinitionUpdateHandler> logger,
        IRepository<OptionSetDefinition> optionSetDefinitionRepository,
        IValidator<OptionSetDefinitionUpdateCommand> validator)
    {
        _logger = logger;
        _optionSetDefinitionRepository = optionSetDefinitionRepository;
        _validator = validator;
    }

    public async Task<Result<OptionSetDefinition>> Handle(OptionSetDefinitionUpdateCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result<OptionSetDefinition>.Invalid(validationResult.Errors.ToValidationError());
        }

        var existingEntity = await _optionSetDefinitionRepository.FirstOrDefaultAsync(new GetById(command.OptionSetDefinition.Id), cancellationToken);

        if (existingEntity == null)
        {
            return Result<OptionSetDefinition>.NotFound();
        }

        if (!string.Equals(existingEntity.Name, command.OptionSetDefinition.Name, StringComparison.OrdinalIgnoreCase))
        {
            return Result<OptionSetDefinition>.Invalid(new ValidationError("Changing Name is Unsupprted Operation"));
        }
        existingEntity.UpdateOptionSetDefinition(existingEntity);
        try
        {
            await _optionSetDefinitionRepository.UpdateAsync(existingEntity, cancellationToken);
            return Result.Success(existingEntity);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating the custom entity");
            return Result<OptionSetDefinition>.Error("Unhandled exception occurred, please try again later");
        }
    }
}
