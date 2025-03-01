﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ardalis.Result;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.SharedKernel.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Create;
public class CustomEntityCreateHandler(ILogger<CustomEntityCreateHandler> logger, IRepository<CustomEntity> customEntityRepository, IValidator<CustomEntityCreateCommand> validator) : IRequestHandler<CustomEntityCreateCommand, Result<CustomEntity>>
{
    private readonly ILogger<CustomEntityCreateHandler> _logger = logger;
    private readonly IRepository<CustomEntity> _customEntityRepository = customEntityRepository;
    private readonly IValidator<CustomEntityCreateCommand> _validator = validator;

    public async Task<Result<CustomEntity>> Handle(CustomEntityCreateCommand command, CancellationToken cancellationToken)
    {
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        if (!validationResult.IsValid)
        {
            return Result<CustomEntity>.Invalid(new ValidationError(validationResult.ToString()));
        }
        var isNameExist = await _customEntityRepository.AnyAsync(new GetByNameSpec(command.CustomEntity.Name));
        if (isNameExist) 
        {
            return Result<CustomEntity>.Invalid(new ValidationError("Custom Entity with such name already exists"));
        }
        if (command.CustomEntity.Id != default(Guid)) 
        {
            var isIdExist = (await _customEntityRepository.GetByIdAsync(command.CustomEntity.Id)) is not null;
            if (isIdExist) 
            {
                return Result<CustomEntity>.Invalid(new ValidationError("Custom Entity with such Id already exists"));
            }
        }
        try
        {
            var result = await _customEntityRepository.AddAsync(command.CustomEntity);
            return Result.Created(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occured while creating custom entity");
            return Result<CustomEntity>.Error("Unhandeled exception occured, please try again later");
        }
    }
}
