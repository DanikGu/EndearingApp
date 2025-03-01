using Ardalis.Result;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Delete;

public class CustomEntityDeleteHandler : IRequestHandler<CustomEntityDeleteCommand, Result>
{
    private readonly ILogger<CustomEntityDeleteHandler> _logger;
    private readonly IRepository<CustomEntity> _customEntityRepository;
    private readonly IValidator<CustomEntityDeleteCommand> _validator;

    public CustomEntityDeleteHandler(
        ILogger<CustomEntityDeleteHandler> logger,
        IRepository<CustomEntity> customEntityRepository,
        IValidator<CustomEntityDeleteCommand> validator)
    {
        _logger = logger;
        _customEntityRepository = customEntityRepository;
        _validator = validator;
    }

    public async Task<Result> Handle(CustomEntityDeleteCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result.Invalid(new ValidationError(validationResult.ToString()));
        }

        var existingEntity = await _customEntityRepository.GetByIdAsync(command.Id, cancellationToken);
        if (existingEntity == null)
        {
            return Result.NotFound();
        }

        try
        {
            await _customEntityRepository.DeleteAsync(existingEntity, cancellationToken);
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting the custom entity");
            return Result.Error("Unhandled exception occurred, please try again later");
        }
    }
}
