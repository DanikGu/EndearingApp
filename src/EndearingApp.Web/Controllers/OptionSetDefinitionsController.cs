using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Infrastructure.Data;
using EndearingApp.Web.Models;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OptionSetDefinitionsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<OptionSetDefinitionsController> _logger;

    public OptionSetDefinitionsController(
        AppDbContext context,
        ILogger<OptionSetDefinitionsController> logger
    )
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/OptionSetDefinitions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OptionSetDefinitionDTO>>> GetOptionSetDefentions()
    {
        var entities = await _context.OptionSetDefentions.Include(x => x.Options).ToListAsync();
        return entities.Select(x => x.Adapt<OptionSetDefinitionDTO>()).ToList();
    }

    // GET: api/OptionSetDefinitions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<OptionSetDefinitionDTO>> GetOptionSetDefinition(Guid id)
    {
        var optionSetDefinition = await _context
            .OptionSetDefentions.Include(x => x.Options)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (optionSetDefinition == null)
        {
            return NotFound();
        }

        return optionSetDefinition.Adapt<OptionSetDefinitionDTO>();
    }

    // PUT: api/OptionSetDefinitions/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutOptionSetDefinition(
        Guid id,
        OptionSetDefinitionDTO optionSetDefinitionDto
    )
    {
        if (id != optionSetDefinitionDto.Id)
        {
            return BadRequest();
        }
        var optionSetDefinition = optionSetDefinitionDto.Adapt<OptionSetDefinition>();
        _logger.LogInformation(
            JsonConvert.SerializeObject(optionSetDefinition, Formatting.Indented)
        );
        _context.Entry(optionSetDefinition).State = EntityState.Modified;
        foreach (var option in optionSetDefinition.Options)
        {
            option.OptionSetId = optionSetDefinition.Id;
            if (option.Id == Guid.Empty)
            {
                _context.Add(option);
            }
            else
            {
                if (optionSetDefinition.Options.FirstOrDefault(x => x.Id == option.Id) is null)
                {
                    _context.Options.Remove(option);
                }
                else
                {
                    _context.Options.Update(option);
                }
            }
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!OptionSetDefinitionExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/OptionSetDefinitions
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<OptionSetDefinitionDTO>> PostOptionSetDefinition(
        OptionSetDefinitionDTO optionSetDefinition
    )
    {
        var entry = _context.OptionSetDefentions.Add(
            optionSetDefinition.Adapt<OptionSetDefinition>()
        );
        await _context.SaveChangesAsync();
        entry.Reload();

        return CreatedAtAction(
            "GetOptionSetDefinition",
            new { id = entry.Entity.Id },
            entry.Entity
        );
    }

    // DELETE: api/OptionSetDefinitions/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOptionSetDefinition(Guid id)
    {
        var optionSetDefinition = await _context.OptionSetDefentions.FindAsync(id);
        if (optionSetDefinition == null)
        {
            return NotFound();
        }

        _context.OptionSetDefentions.Remove(optionSetDefinition);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool OptionSetDefinitionExists(Guid id)
    {
        return _context.OptionSetDefentions.Any(e => e.Id == id);
    }
}
