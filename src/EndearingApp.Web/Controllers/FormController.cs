using Ardalis.Result.AspNetCore;
using Ardalis.Result;
using EndearingApp.Core.FormAggregate;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Models;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using EndearingApp.Core.FormAggregate.Commands.FormCommands.Create;
using EndearingApp.Core.FormAggregate.Commands.FormCommands.Delete;
using EndearingApp.Core.FormAggregate.Commands.FormCommands.Update;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FormController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IRepository<Form> _repository;

    public FormController(IMediator mediator, IRepository<Form> repository)
    {
        _mediator = mediator;
        _repository = repository;
    }
    [TranslateResultToActionResult]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FormDTO>>> GetForms(CancellationToken cancellationToken)
    {
        var etns = await _repository.ListAsync(cancellationToken);
        return etns.Select(x => x.Adapt<FormDTO>()).ToList();
    }
    [TranslateResultToActionResult]
    [HttpGet("{id}")]
    public async Task<ActionResult<FormDTO>> GetForm(Guid id, CancellationToken cancellationToken)
    {
        var customEntity = await _repository.GetByIdAsync(id, cancellationToken);
        return customEntity.Adapt<FormDTO>();
    }
    [TranslateResultToActionResult]
    [HttpPut("{id}")]
    public async Task<Result<FormDTO>> PutForm(Guid id, FormDTO customEntityDto, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new FormUpdateCommand(customEntityDto.Adapt<Form>()), cancellationToken);
        return result.Map(x => x.Adapt<FormDTO>());
    }
    [TranslateResultToActionResult]
    [HttpPost]
    public async Task<Result<FormDTO>> PostForm(
        FormDTO customEntityDto,
        CancellationToken cancellationToken
    )
    {
        var result = await _mediator.Send(new FormCreateCommand(customEntityDto.Adapt<Form>()), cancellationToken);
        return result.Map(x => x.Adapt<FormDTO>());
    }
    [TranslateResultToActionResult]
    [HttpDelete("{id}")]
    public async Task<Result> DeleteForm(Guid id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new FormDeleteCommand(id), cancellationToken);
        return result;
    }
}
