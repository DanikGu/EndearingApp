using Ardalis.Result;
using EndearingApp.Core.Exstensions;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.FormAggregate.Commands.FormCommands.Delete;

public class FormDeleteHandler : IRequestHandler<FormDeleteCommand, Result>
{
    private readonly ILogger<FormDeleteHandler> _logger;
    private readonly IRepository<Form> _formRepository;
    private readonly IValidator<FormDeleteCommand> _validator;

    public FormDeleteHandler(
        ILogger<FormDeleteHandler> logger,
        IRepository<Form> formRepository,
        IValidator<FormDeleteCommand> validator)
    {
        _logger = logger;
        _formRepository = formRepository;
        _validator = validator;
    }

    public async Task<Result> Handle(FormDeleteCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result.Invalid(validationResult.Errors.ToValidationError());
        }

        var existingEntity = await _formRepository.GetByIdAsync(command.Id, cancellationToken);
        if (existingEntity == null)
        {
            return Result.NotFound();
        }

        try
        {
            await _formRepository.DeleteAsync(existingEntity, cancellationToken);
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting the custom entity");
            return Result.Error("Unhandled exception occurred, please try again later");
        }
    }
}
