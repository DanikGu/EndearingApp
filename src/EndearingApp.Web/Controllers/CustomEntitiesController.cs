using Ardalis.Result;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Create;
using EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Delete;
using EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Update;
using EndearingApp.Infrastructure.Data;
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
    private readonly AppDbContext _context;
    private readonly ILogger<CustomEntitiesController> _logger;

    public CustomEntitiesController(IMediator mediator, IRepository<CustomEntity> repository, AppDbContext context, ILogger<CustomEntitiesController> logger)
    {
        _mediator = mediator;
        _repository = repository;
        _context = context;
        _logger = logger;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomeEntityDTO>>> GetCustomEntities()
    {
        var etns = await _repository.ListAsync();
        return etns.Select(x => x.Adapt<CustomeEntityDTO>()).ToList();
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomeEntityDTO>> GetCustomEntity(Guid id)
    {
        var customEntity = await _repository.GetByIdAsync(id);
        return customEntity.Adapt<CustomeEntityDTO>();
    }
    [HttpPut("{id}")]
    public async Task<Result<CustomEntity>> PutCustomEntity(Guid id, CustomeEntityDTO customEntityDto)
    {
        var result = await _mediator.Send(new CustomEntityUpdateCommand(customEntityDto.Adapt<CustomEntity>()));
        return result;
    }
    [HttpPost]
    public async Task<Result<CustomEntity>> PostCustomEntity(
        CustomeEntityDTO customEntityDto
    )
    {
        var result = await _mediator.Send(new CustomEntityCreateCommand(customEntityDto.Adapt<CustomEntity>()));
        return result;
    }
    [HttpDelete("{id}")]
    public async Task<Result> DeleteCustomEntity(Guid id)
    {
        var result = await _mediator.Send(new CustomEntityDeleteCommand(id));
        return result;
    }
}
