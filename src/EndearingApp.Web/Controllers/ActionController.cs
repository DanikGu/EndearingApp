using EndearingApp.Core.CustomEntityAggregate.Events;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ActionController : Controller
{
    private readonly IMediator _mediator;

    public ActionController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpPost("UpdateDbStructure")]
    public async Task<IActionResult> UpdateDbStructure()
    {
        await _mediator.Publish(new CustomDbStructureChangedEvent());
        return Ok();
    }
}

