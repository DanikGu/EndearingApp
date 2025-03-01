using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ardalis.Result;
using FluentValidation.Results;

namespace EndearingApp.Core.Exstensions;
public static class FluentValidatorExstensions
{
    public static IEnumerable<ValidationError> ToValidationError(this IEnumerable<ValidationFailure> validationResult)
    {
        return validationResult.Select(e => new ValidationError() { 
            ErrorMessage =  e.ErrorMessage,
            ErrorCode = e.ErrorCode,
            Severity = ValidationSeverity.Error
        }).ToList();
    }
}
