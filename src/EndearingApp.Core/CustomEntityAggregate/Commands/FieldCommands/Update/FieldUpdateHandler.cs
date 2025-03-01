using Ardalis.Result;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.Core.Exstensions;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Update;

public class FieldUpdateHandler : IRequestHandler<FieldUpdateCommand, Result<Field>>
{
    private readonly ILogger<FieldUpdateHandler> _logger;
    private readonly IRepository<CustomEntity> _customEntityRepository;
    private readonly IValidator<FieldUpdateCommand> _validator;

    public FieldUpdateHandler(
        ILogger<FieldUpdateHandler> logger,
        IRepository<CustomEntity> customEntityRepository,
        IValidator<FieldUpdateCommand> validator)
    {
        _logger = logger;
        _customEntityRepository = customEntityRepository;
        _validator = validator;
    }

    public async Task<Result<Field>> Handle(FieldUpdateCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result<Field>.Invalid(validationResult.Errors.ToValidationError());
        }

        var existingEntity = await _customEntityRepository.
            FirstOrDefaultAsync(new GetByFieldId(command.Field.Id), cancellationToken);
        if (existingEntity == null)
        {
            return Result<Field>.NotFound();
        }
        var existingField = existingEntity.Fields.FirstOrDefault(x => x.Id == command.Field.Id);

        if (!string.Equals(existingField!.Name, command.Field.Name, StringComparison.OrdinalIgnoreCase))
        {
            return Result<Field>.Invalid(new ValidationError("Changing Name is Unsupprted Operation"));
        }

        var result = existingEntity.UpdateField(command.Field);
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
            _logger.LogError(ex, "An error occurred while updating the custom entity");
            return Result<Field>.Error("Unhandled exception occurred, please try again later");
        }
    }
}
