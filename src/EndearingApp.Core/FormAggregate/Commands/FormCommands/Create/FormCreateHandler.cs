using Ardalis.Result;
using EndearingApp.Core.Exstensions;
using EndearingApp.Core.FormAggregate.Specifications;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.FormAggregate.Commands.FormCommands.Create;
public class FormCreateHandler(ILogger<FormCreateHandler> logger, IRepository<Form> formRepository, IValidator<FormCreateCommand> validator) : IRequestHandler<FormCreateCommand, Result<Form>>
{
    private readonly ILogger<FormCreateHandler> _logger = logger;
    private readonly IRepository<Form> _formRepository = formRepository;
    private readonly IValidator<FormCreateCommand> _validator = validator;

    public async Task<Result<Form>> Handle(FormCreateCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result<Form>.Invalid(validationResult.Errors.ToValidationError());
        }
        var isNameExist = await _formRepository.AnyAsync(new GetByNameSpec(command.Form.Name), cancellationToken);
        if (isNameExist) 
        {
            return Result<Form>.Invalid(new ValidationError("Custom Entity with such name already exists"));
        }
        if (command.Form.Id != default(Guid)) 
        {
            var isIdExist = (await _formRepository.GetByIdAsync(command.Form.Id, cancellationToken)) is not null;
            if (isIdExist) 
            {
                return Result<Form>.Invalid(new ValidationError("Custom Entity with such Id already exists"));
            }
        }
        try
        {
            var result = await _formRepository.AddAsync(command.Form, cancellationToken);
            return Result.Created(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occured while creating custom entity");
            return Result<Form>.Error("Unhandeled exception occured, please try again later");
        }
    }
}
