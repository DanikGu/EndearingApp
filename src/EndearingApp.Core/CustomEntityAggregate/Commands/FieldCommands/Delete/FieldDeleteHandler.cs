using Ardalis.Result;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.Core.Exstensions;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Delete;

public class FieldDeleteHandler : IRequestHandler<FieldDeleteCommand, Result>
{
    private readonly ILogger<FieldDeleteHandler> _logger;
    private readonly IRepository<CustomEntity> _customEntityRepository;
    private readonly IValidator<FieldDeleteCommand> _validator;

    public FieldDeleteHandler(
        ILogger<FieldDeleteHandler> logger,
        IRepository<CustomEntity> customEntityRepository,
        IValidator<FieldDeleteCommand> validator)
    {
        _logger = logger;
        _customEntityRepository = customEntityRepository;
        _validator = validator;
    }

    public async Task<Result> Handle(FieldDeleteCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result.Invalid(validationResult.Errors.ToValidationError());
        }

        var existingEntity = await _customEntityRepository.FirstOrDefaultAsync(new GetByFieldId(command.FieldId), cancellationToken);
        if (existingEntity == null)
        {
            return Result.NotFound("Field does not exists");
        }
        var result = existingEntity.RemoveField(command.FieldId);
        if (!result.IsSuccess) 
        {
            return result;
        }
        try
        {
            await _customEntityRepository.UpdateAsync(existingEntity, cancellationToken);
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting the custom entity");
            return Result.Error("Unhandled exception occurred, please try again later");
        }
    }
}
