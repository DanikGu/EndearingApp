using Ardalis.Result;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.Core.Exstensions;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Update;

public class CustomEntityUpdateHandler : IRequestHandler<CustomEntityUpdateCommand, Result<CustomEntity>>
{
    private readonly ILogger<CustomEntityUpdateHandler> _logger;
    private readonly IRepository<CustomEntity> _customEntityRepository;
    private readonly IValidator<CustomEntityUpdateCommand> _validator;

    public CustomEntityUpdateHandler(
        ILogger<CustomEntityUpdateHandler> logger,
        IRepository<CustomEntity> customEntityRepository,
        IValidator<CustomEntityUpdateCommand> validator)
    {
        _logger = logger;
        _customEntityRepository = customEntityRepository;
        _validator = validator;
    }

    public async Task<Result<CustomEntity>> Handle(CustomEntityUpdateCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result<CustomEntity>.Invalid(validationResult.Errors.ToValidationError());
        }

        var existingEntity = await _customEntityRepository.FirstOrDefaultAsync(new GetById(command.CustomEntity.Id), cancellationToken);

        if (existingEntity == null)
        {
            return Result<CustomEntity>.NotFound();
        }

        if (!string.Equals(existingEntity.Name, command.CustomEntity.Name, StringComparison.OrdinalIgnoreCase))
        {
            return Result<CustomEntity>.Invalid(new ValidationError("Changing Name is Unsupprted Operation"));
        }
        existingEntity.UpdateCustomeEntity(existingEntity);
        try
        {
            await _customEntityRepository.UpdateAsync(existingEntity, cancellationToken);
            return Result.Success(existingEntity);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating the custom entity");
            return Result<CustomEntity>.Error("Unhandled exception occurred, please try again later");
        }
    }
}
