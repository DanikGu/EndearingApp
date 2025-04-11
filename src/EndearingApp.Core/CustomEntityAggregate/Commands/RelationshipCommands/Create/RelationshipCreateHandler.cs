using Ardalis.Result;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.Core.Exstensions;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.RelationshipCommands.Create;
public class RelationshipCreateHandler : IRequestHandler<RelationshipCreateCommand, Result<Relationship>>
{
    private readonly ILogger<RelationshipCreateHandler> _logger;
    private readonly IRepository<CustomEntity> _customEntityRepository;
    private readonly IValidator<RelationshipCreateCommand> _validator;

    public RelationshipCreateHandler(ILogger<RelationshipCreateHandler> logger,
                              IRepository<CustomEntity> customEntityRepository,
                              IValidator<RelationshipCreateCommand> validator)
    {
        _logger = logger;
        _customEntityRepository = customEntityRepository;
        _validator = validator;
    }

    public async Task<Result<Relationship>> Handle(RelationshipCreateCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result<Relationship>.Invalid(validationResult.Errors.ToValidationError());
        }
        var customEntity = await _customEntityRepository.
            FirstOrDefaultAsync(new GetByFieldId(command.Relationship.SourceFieldId), cancellationToken);
        if (customEntity is null)
        {
            return Result<Relationship>.Invalid(new ValidationError("Custom Entity does not exist"));
        }
        if (customEntity.Relationships.Any(f => f.ConstraintName == command.Relationship.ConstraintName))
        {
            return Result<Relationship>.Invalid(new ValidationError(nameof(command.Relationship.ConstraintName), "Relationship with such ConstraintName already exists in the Custom Entity"));
        }
        if (command.Relationship.Id != default(Guid))
        {
            if (customEntity.Relationships.Any(f => f.Id == command.Relationship.Id))
            {
                return Result<Relationship>.Invalid(new ValidationError("Relationship with such Id already exists in the Custom Entity"));
            }
        }
        var addResult = customEntity.AddRelationship(command.Relationship);
        if (!addResult.IsSuccess)
        {
            return addResult;
        }
        try
        {
            await _customEntityRepository.UpdateAsync(customEntity, cancellationToken);
            return Result.Created(command.Relationship);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating Relationships for custom entity");
            return Result<Relationship>.Error("Unhandled exception occurred, please try again later");
        }
    }
}
