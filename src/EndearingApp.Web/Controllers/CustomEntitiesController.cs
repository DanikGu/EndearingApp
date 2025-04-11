using System.Threading;
using Ardalis.Result;
using Ardalis.Result.AspNetCore;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Create;
using EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Delete;
using EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Update;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Models;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CustomEntitiesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IRepository<CustomEntity> _repository;

    public CustomEntitiesController(IMediator mediator, IRepository<CustomEntity> repository)
    {
        _mediator = mediator;
        _repository = repository;
    }
    [TranslateResultToActionResult]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomeEntityDTO>>> GetCustomEntities(CancellationToken cancellationToken)
    {
        var etns = await _repository.ListAsync(new GetAllSpec(), cancellationToken);
        return etns.Select(x => x.Adapt<CustomeEntityDTO>()).ToList();
    }
    [TranslateResultToActionResult]
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomeEntityDTO>> GetCustomEntity(Guid id, CancellationToken cancellationToken)
    {
        var customEntity = await _repository.FirstOrDefaultAsync(new GetById(id), cancellationToken);
        return customEntity.Adapt<CustomeEntityDTO>();
    }
    [TranslateResultToActionResult]
    [HttpPut("{id}")]
    public async Task<Result<CustomeEntityDTO>> PutCustomEntity(Guid id, CustomeEntityDTO customEntityDto, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new CustomEntityUpdateCommand(customEntityDto.Adapt<CustomEntity>()), cancellationToken);
        return result.Map(x => x.Adapt<CustomeEntityDTO>());
    }
    [TranslateResultToActionResult]
    [HttpPost]
    public async Task<Result<CustomeEntityDTO>> PostCustomEntity(
        CustomeEntityDTO customEntityDto, 
        CancellationToken cancellationToken
    )
    {
        var result = await _mediator.Send(new CustomEntityCreateCommand(customEntityDto.Adapt<CustomEntity>()), cancellationToken);
        return result.Map(x => x.Adapt<CustomeEntityDTO>());
    }
    [TranslateResultToActionResult]
    [HttpDelete("{id}")]
    public async Task<Result> DeleteCustomEntity(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new CustomEntityDeleteCommand(id), cancellationToken);
        return result;
    }
}
