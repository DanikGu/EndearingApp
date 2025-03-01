using Ardalis.Result;
using Ardalis.Result.AspNetCore;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.CustomEntityAggregate.Commands.CustomEntityCommands.Create;
using EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Create;
using EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Delete;
using EndearingApp.Core.CustomEntityAggregate.Commands.FieldCommands.Update;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.Infrastructure.Data;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Models;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NuGet.Protocol.Core.Types;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FieldsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IRepository<CustomEntity> _repository;

    public FieldsController(IMediator mediator, IRepository<CustomEntity> repository)
    {
        _mediator = mediator;
        _repository = repository;
    }

    [TranslateResultToActionResult]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FieldDto>>> GetFields()
    {
        var entities = await _repository.ListAsync(new GetAllSpec());
        return entities
            .SelectMany(x => x.Fields)
            .Select(x => x.Adapt<FieldDto>())
            .ToList();
    }

    [TranslateResultToActionResult]
    [HttpGet("{id}")]
    public async Task<ActionResult<FieldDto>> GetField(Guid id)
    {
        var customEntity = await _repository.FirstOrDefaultAsync(new GetByFieldId(id));
        if (customEntity is null)
        {
            return NotFound();
        }
        var @field = customEntity.Fields.FirstOrDefault(x => x.Id == id);
        if (@field is null)
        {
            return NotFound();
        }

        return @field.Adapt<FieldDto>();
    }

    [TranslateResultToActionResult]
    [HttpPut("{id}")]
    public async Task<Result<FieldDto>> PutField(Guid id, FieldDto fieldDto)
    {
        var result = await _mediator.Send(new FieldUpdateCommand(fieldDto.Adapt<Field>()));
        return result.Map(x => x.Adapt<FieldDto>());
    }

    [TranslateResultToActionResult]
    [HttpPost]
    public async Task<Result<FieldDto>> PostField(FieldDto @field)
    {
        var result = await _mediator.Send(new FieldCreateCommand(@field.Adapt<Field>()));
        return result.Map(x => x.Adapt<FieldDto>());
    }

    [TranslateResultToActionResult]
    [HttpPatch]
    public async Task<Result<FieldDto>> PatchField(Guid id, string fieldDelta)
    {
        var customEntity = await _repository.FirstOrDefaultAsync(new GetByFieldId(id));
        if (customEntity is null)
        {
            return Result.NotFound();
        }
        var @field = customEntity.Fields.FirstOrDefault(x => x.Id == id);
        if (@field is null)
        {
            return Result.NotFound();
        }
        var fieldDeltaObj = JsonConvert.DeserializeObject<PatchDelta<Field>>(fieldDelta);
        if (fieldDeltaObj is null) 
        {
            return Result.Error("Invalid json");
        }
        fieldDeltaObj.Patch(@field);
        var result = await _mediator.Send(new FieldUpdateCommand(@field));
        return result.Map(x => x.Adapt<FieldDto>());
    }

    [TranslateResultToActionResult]
    [HttpDelete("{id}")]
    public async Task<Result> DeleteField(Guid id)
    {
        var result = await _mediator.Send(new FieldDeleteCommand(id));
        return result;
    }

}
