using System.Threading;
using Ardalis.Result;
using Ardalis.Result.AspNetCore;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.OptionSetDefinitionAggregate;
using EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Create;
using EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Delete;
using EndearingApp.Core.OptionSetDefinitionAggregate.Commands.OptionSetCommands.Update;
using EndearingApp.Core.OptionSetDefinitionAggregate.Specifications;
using EndearingApp.Infrastructure.Data;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Models;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OptionSetDefinitionsController : ControllerBase
{   
    private readonly ILogger<OptionSetDefinitionsController> _logger;
    private readonly IMediator _mediator;
    private readonly IRepository<OptionSetDefinition> _repository;

    public OptionSetDefinitionsController(IMediator mediator, 
        IRepository<OptionSetDefinition> repository, 
        ILogger<OptionSetDefinitionsController> logger)
    {
        _mediator = mediator;
        _repository = repository;
        _logger = logger;
    }

    [TranslateResultToActionResult]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OptionSetDefinitionDTO>>> GetOptionSetDefentions(CancellationToken cancellationToken)
    {
        var entities = await _repository.ListAsync(new GetAllSpec(), cancellationToken);
        return entities.Select(x => x.Adapt<OptionSetDefinitionDTO>()).ToList();
    }

    [TranslateResultToActionResult]
    [HttpGet("{id}")]
    public async Task<ActionResult<OptionSetDefinitionDTO>> GetOptionSetDefinition(Guid id, CancellationToken cancellationToken)
    {
        var optionSetDefinition = await _repository.FirstOrDefaultAsync(new GetAllSpec(), cancellationToken);
        if (optionSetDefinition == null)
        {
            return NotFound();
        }
        return optionSetDefinition.Adapt<OptionSetDefinitionDTO>();
    }

    [TranslateResultToActionResult]
    [HttpPut("{id}")]
    public async Task<Result<OptionSetDefinitionDTO>> PutOptionSetDefinition(
        Guid id,
        OptionSetDefinitionDTO optionSetDefinitionDto, 
        CancellationToken cancellationToken
    )
    {
        if (id != optionSetDefinitionDto.Id)
        {
            return Result.Invalid(new ValidationError("Ids are different"));
        }
        var result = await _mediator.Send(
            new OptionSetDefinitionUpdateCommand(optionSetDefinitionDto.Adapt<OptionSetDefinition>()),
            cancellationToken
        );

        return result.Map(x => x.Adapt<OptionSetDefinitionDTO>());
    }

    [TranslateResultToActionResult]
    [HttpPost]
    public async Task<Result<OptionSetDefinitionDTO>> PostOptionSetDefinition(
        OptionSetDefinitionDTO optionSetDefinitionDto,
        CancellationToken cancellationToken
    )
    {
        var result = await _mediator.Send(
            new OptionSetDefinitionCreateCommand(optionSetDefinitionDto.Adapt<OptionSetDefinition>()),
            cancellationToken
        );

        return result.Map(x => x.Adapt<OptionSetDefinitionDTO>());
    }

    [TranslateResultToActionResult]
    [HttpDelete("{id}")]
    public async Task<Result> DeleteOptionSetDefinition(Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new OptionSetDefinitionDeleteCommand(id),
            cancellationToken
        );

        return result;
    }
}
