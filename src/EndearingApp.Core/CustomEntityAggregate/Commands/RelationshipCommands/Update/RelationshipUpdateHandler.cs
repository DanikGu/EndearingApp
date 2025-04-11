using Ardalis.Result;
using EndearingApp.Core.CustomEntityAggregate.DbStructureModels;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.Core.Exstensions;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.RelationshipCommands.Update;

public class RelationshipUpdateHandler : IRequestHandler<RelationshipUpdateCommand, Result<Relationship>>
{
    private readonly ILogger<RelationshipUpdateHandler> _logger;
    private readonly IRepository<CustomEntity> _customEntityRepository;
    private readonly IValidator<RelationshipUpdateCommand> _validator;

    public RelationshipUpdateHandler(
        ILogger<RelationshipUpdateHandler> logger,
        IRepository<CustomEntity> customEntityRepository,
        IValidator<RelationshipUpdateCommand> validator)
    {
        _logger = logger;
        _customEntityRepository = customEntityRepository;
        _validator = validator;
    }

    public async Task<Result<Relationship>> Handle(RelationshipUpdateCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result<Relationship>.Invalid(validationResult.Errors.ToValidationError());
        }

        var existingEntity = await _customEntityRepository.
            FirstOrDefaultAsync(new GetByFieldId(command.Relationship.SourceFieldId), cancellationToken);
        if (existingEntity == null)
        {
            return Result<Relationship>.NotFound();
        }
        var existingRelationship = existingEntity.Relationships.FirstOrDefault(x => x.Id == command.Relationship.Id);

        if (!string.Equals(existingRelationship!.ConstraintName, command.Relationship.ConstraintName, StringComparison.OrdinalIgnoreCase))
        {
            return Result<Relationship>.Invalid(new ValidationError("Changing Name is Unsupprted Operation"));
        }

        var result = existingEntity.UpdateRelationship(command.Relationship);
        if (!result.IsSuccess)
        {
            return result;
        }

        try
        {
            await _customEntityRepository.UpdateAsync(existingEntity, cancellationToken);
            return Result.Success(command.Relationship);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating the custom entity");
            return Result<Relationship>.Error("Unhandled exception occurred, please try again later");
        }
    }
}
