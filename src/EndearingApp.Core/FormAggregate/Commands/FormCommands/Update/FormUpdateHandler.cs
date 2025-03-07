using Ardalis.Result;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.Core.Exstensions;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using Mapster;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.FormAggregate.Commands.FormCommands.Update;

public class FormUpdateHandler : IRequestHandler<FormUpdateCommand, Result<Form>>
{
    private readonly ILogger<FormUpdateHandler> _logger;
    private readonly IRepository<Form> _formRepository;
    private readonly IValidator<FormUpdateCommand> _validator;

    public FormUpdateHandler(
        ILogger<FormUpdateHandler> logger,
        IRepository<Form> customEntityRepository,
        IValidator<FormUpdateCommand> validator)
    {
        _logger = logger;
        _formRepository = customEntityRepository;
        _validator = validator;
    }

    public async Task<Result<Form>> Handle(FormUpdateCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result<Form>.Invalid(validationResult.Errors.ToValidationError());
        }

        var existingEntity = await _formRepository.GetByIdAsync(command.Form.Id);

        if (existingEntity == null)
        {
            return Result<Form>.NotFound();
        }

        if (!string.Equals(existingEntity.Name, command.Form.Name, StringComparison.OrdinalIgnoreCase))
        {
            return Result<Form>.Invalid(new ValidationError("Changing Name is Unsupprted Operation"));
        }
        existingEntity.UpdateForm(command.Form);
        try
        {
            await _formRepository.UpdateAsync(existingEntity, cancellationToken);
            return Result.Success(existingEntity);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating the custom entity");
            return Result<Form>.Error("Unhandled exception occurred, please try again later");
        }
    }
}
