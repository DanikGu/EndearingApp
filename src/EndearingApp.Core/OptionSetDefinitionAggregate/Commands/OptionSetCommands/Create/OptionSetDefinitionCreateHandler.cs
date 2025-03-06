using Ardalis.Result;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.Core.OptionSetDefinitionAggregate.Specifications;
using EndearingApp.Core.Exstensions;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using GetCustomEntityByNameSpec = EndearingApp.Core.CustomEntityAggregate.Specifications.GetByNameSpec;
using GetOptionSetByNameSpec = EndearingApp.Core.OptionSetDefinitionAggregate.Specifications.GetByNameSpec;
using EndearingApp.Core.CustomEntityAggregate;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Create;
public class OptionSetDefinitionCreateHandler(
    ILogger<OptionSetDefinitionCreateHandler> logger,
    IRepository<CustomEntity> customEntityRepository,
    IRepository<OptionSetDefinition> optionSetDefinitionRepository, 
    IValidator<OptionSetDefinitionCreateCommand> validator) : IRequestHandler<OptionSetDefinitionCreateCommand, Result<OptionSetDefinition>>
{
    private readonly ILogger<OptionSetDefinitionCreateHandler> _logger = logger;
    private readonly IRepository<OptionSetDefinition> _optionSetDefinitionRepository = optionSetDefinitionRepository;
    private readonly IRepository<CustomEntity> _customEntityRepository = customEntityRepository;
    private readonly IValidator<OptionSetDefinitionCreateCommand> _validator = validator;

    public async Task<Result<OptionSetDefinition>> Handle(OptionSetDefinitionCreateCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result<OptionSetDefinition>.Invalid(validationResult.Errors.ToValidationError());
        }
        var isNameExist = await _optionSetDefinitionRepository.AnyAsync(new GetOptionSetByNameSpec(command.OptionSetDefinition.Name), cancellationToken);
        if (isNameExist) 
        {
            return Result<OptionSetDefinition>.Invalid(new ValidationError("OptionSet with such name already exists"));
        }
        isNameExist = await _customEntityRepository.AnyAsync(new GetCustomEntityByNameSpec(command.OptionSetDefinition.Name), cancellationToken);
        if (isNameExist)
        {
            return Result<OptionSetDefinition>.Invalid(new ValidationError("Custom Entity with such name already exists"));
        }
        if (command.OptionSetDefinition.Id != default(Guid)) 
        {
            var isIdExist = (await _optionSetDefinitionRepository.GetByIdAsync(command.OptionSetDefinition.Id, cancellationToken)) is not null;
            if (isIdExist) 
            {
                return Result<OptionSetDefinition>.Invalid(new ValidationError("Custom Entity with such Id already exists"));
            }
        }
        try
        {
            var result = await _optionSetDefinitionRepository.AddAsync(command.OptionSetDefinition, cancellationToken);
            return Result.Created(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occured while creating custom entity");
            return Result<OptionSetDefinition>.Error("Unhandeled exception occured, please try again later");
        }
    }
}
