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
    public async Task<IActionResult> UpdateDbStructure(CancellationToken cancellationToken)
    {
        using var activity = Program.EndearingAppActivitySource.StartActivity("UpdateDbStructureActivity");
        activity!.AddEvent(new System.Diagnostics.ActivityEvent("chlen"));
        await _mediator.Publish(new CustomDbStructureChangedEvent(), cancellationToken);
        return Ok();
    }
}

