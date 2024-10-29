using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Infrastructure.Data;
using EndearingApp.Web.Models;
using Mapster;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OptionSetDefinitionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public OptionSetDefinitionsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/OptionSetDefinitions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OptionSetDefinitionDTO>>> GetOptionSetDefentions()
    {
        var entities = await _context.OptionSetDefentions.ToListAsync();
        return entities.Select(x => x.Adapt<OptionSetDefinitionDTO>()).ToList();
    }

    // GET: api/OptionSetDefinitions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<OptionSetDefinitionDTO>> GetOptionSetDefinition(Guid id)
    {
        var optionSetDefinition = await _context.OptionSetDefentions.FindAsync(id);

        if (optionSetDefinition == null)
        {
            return NotFound();
        }

        return optionSetDefinition.Adapt<OptionSetDefinitionDTO>();
    }

    // PUT: api/OptionSetDefinitions/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutOptionSetDefinition(Guid id, OptionSetDefinitionDTO optionSetDefinitionDto)
    {
        if (id != optionSetDefinitionDto.Id)
        {
            return BadRequest();
        }
        var optionSetDefinition = optionSetDefinitionDto.Adapt<OptionSetDefinition>();

        _context.Entry(optionSetDefinition).State = EntityState.Modified;

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
    public async Task<ActionResult<OptionSetDefinitionDTO>> PostOptionSetDefinition(OptionSetDefinitionDTO optionSetDefinition)
    {
        _context.OptionSetDefentions.Add(optionSetDefinition.Adapt<OptionSetDefinition>());
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetOptionSetDefinition", new { id = optionSetDefinition.Id }, optionSetDefinition);
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
