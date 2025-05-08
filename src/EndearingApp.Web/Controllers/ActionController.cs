using EndearingApp.Core.CustomEntityAggregate.Events;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ActionController : Controller
{
    private readonly IMediator _mediator;
    private readonly ILogger<ActionController> _logger;

    public ActionController(IMediator mediator, ILogger<ActionController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }
    [HttpPost("UpdateDbStructure")]
    public async Task<IActionResult> UpdateDbStructure(CancellationToken cancellationToken)
    {
        _logger.LogInformation("chlen");
        await _mediator.Publish(new CustomDbStructureChangedEvent(), cancellationToken);
        return Ok();
    }
}

