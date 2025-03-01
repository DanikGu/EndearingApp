using Ardalis.Result;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Create;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.Core.Exstensions;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Create;
public class FieldCreateHandler : IRequestHandler<FieldCreateCommand, Result<Field>>
{
    private readonly ILogger<FieldCreateHandler> _logger;
    private readonly IRepository<CustomEntity> _customEntityRepository;
    private readonly IValidator<FieldCreateCommand> _validator;

    public FieldCreateHandler(ILogger<FieldCreateHandler> logger,
                              IRepository<CustomEntity> customEntityRepository,
                              IValidator<FieldCreateCommand> validator)
    {
        _logger = logger;
        _customEntityRepository = customEntityRepository;
        _validator = validator;
    }

    public async Task<Result<Field>> Handle(FieldCreateCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result<Field>.Invalid(validationResult.Errors.ToValidationError());
        }
        var customEntity = await _customEntityRepository.FirstOrDefaultAsync(new GetById(command.Field.CustomEntityId), cancellationToken);
        if (customEntity is null)
        {
            return Result<Field>.Invalid(new ValidationError("Custom Entity does not exist"));
        }
        if (customEntity.Fields.Any(f => f.Name == command.Field.Name))
        {
            return Result<Field>.Invalid(new ValidationError(nameof(command.Field.Name), "Field with such name already exists in the Custom Entity"));
        }
        if (command.Field.Id != default(Guid))
        {
            if (customEntity.Fields.Any(f => f.Id == command.Field.Id))
            {
                return Result<Field>.Invalid(new ValidationError("Field with such Id already exists in the Custom Entity"));
            }
        }
        var addResult = customEntity.AddField(command.Field);
        if (!addResult.IsSuccess)
        {
            return addResult;
        }
        try
        {
            await _customEntityRepository.UpdateAsync(customEntity, cancellationToken);
            return Result.Created(command.Field);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating field for custom entity");
            return Result<Field>.Error("Unhandled exception occurred, please try again later");
        }
    }
}
