using Ardalis.Result;
using Ardalis.Result.AspNetCore;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.CustomEntityAggregate.Commands.RelationshipCommands.Create;
using EndearingApp.Core.CustomEntityAggregate.Commands.RelationshipCommands.Delete;
using EndearingApp.Core.CustomEntityAggregate.Commands.RelationshipCommands.Update;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Models;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RelationshipsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IRepository<CustomEntity> _repository;
    private readonly ILogger<RelationshipsController> _logger;

    public RelationshipsController(IMediator mediator, IRepository<CustomEntity> repository, ILogger<RelationshipsController> logger)
    {
        _mediator = mediator;
        _repository = repository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RelationshipDTO>>> GetRelationships(CancellationToken cancellationToken)
    {
        var entities = await _repository.ListAsync(new GetAllSpec(), cancellationToken);
        return entities.Select(x => x.Adapt<RelationshipDTO>()).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RelationshipDTO>> GetRelationship(Guid id, CancellationToken cancellationToken)
    {
        var relationship = await _repository.FirstOrDefaultAsync(new GetByRelationshipId(id), cancellationToken);

        if (relationship == null)
        {
            return NotFound();
        }

        return relationship.Adapt<RelationshipDTO>();
    }

    [TranslateResultToActionResult]
    [HttpPut("{id}")]
    public async Task<Result<RelationshipDTO>> PutRelationship(Guid id, RelationshipDTO relationship, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new RelationshipUpdateCommand(relationship.Adapt<Relationship>()), cancellationToken);
        return result.Map(x => x.Adapt<RelationshipDTO>());
    }

    [TranslateResultToActionResult]
    [HttpPost]
    public async Task<Result<RelationshipDTO>> PostRelationship(RelationshipDTO relationship, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new RelationshipCreateCommand(relationship.Adapt<Relationship>()), cancellationToken);
        return result.Map(x => x.Adapt<RelationshipDTO>());
    }

    [TranslateResultToActionResult]
    [HttpDelete("{id}")]
    public async Task<Result> DeleteRelationship(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new RelationshipDeleteCommand(id), cancellationToken);
        return result;
    }
}
