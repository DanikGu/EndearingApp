using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Infrastructure.Data;
using EndearingApp.Web.Models;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FieldsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<FieldsController> _logger;

    public FieldsController(AppDbContext context, ILogger<FieldsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/Fields
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FieldDto>>> GetFields()
    {
        var entities = await _context.Fields.ToListAsync();
        return entities.Select(x => x.Adapt<FieldDto>()).ToList();
    }

    // GET: api/Fields/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FieldDto>> GetField(Guid id)
    {
        var @field = await _context.Fields.FindAsync(id);

        if (@field == null)
        {
            return NotFound();
        }

        return @field.Adapt<FieldDto>();
    }

    // PUT: api/Fields/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutField(Guid id, FieldDto fieldDto)
    {
        await Task.Delay(5000);
        if (id != fieldDto.Id)
        {
            return BadRequest();
        }
        var @field = fieldDto.Adapt<Field>();
        _context.Entry(@field).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!FieldExists(id))
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

    // POST: api/Fields
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<FieldDto>> PostField(FieldDto @field)
    {
        _logger.LogInformation(JsonConvert.SerializeObject(@field, Formatting.Indented));
        var etn = @field.Adapt<Field>();
        _context.Fields.Add(etn);
        _logger.LogInformation(JsonConvert.SerializeObject(etn, Formatting.Indented));

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            var mess = ex.Message;
            if (FieldExists(@field.Id))
            {
                return Conflict();
            }
            else
            {
                throw;
            }
        }

        return CreatedAtAction("GetField", new { id = @field.Id }, @field);
    }

    // PATCH: api/Fields
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // Parse delta inside controller because swagger don't understand delta object,
    // there is possible solutions in the internet, but do i care?
    [HttpPatch]
    public async Task<ActionResult<FieldDto>> PatchField(Guid id, string fieldDelta)
    {
        var fieldDeltaObj = JsonConvert.DeserializeObject<PatchDelta<Field>>(fieldDelta);
        var @field = _context.Fields.FirstOrDefault(x => x.Id == id);
        if (@field is null || fieldDeltaObj is null)
        {
            return NotFound();
        }

        _logger.Log(LogLevel.Information, fieldDelta);
        _logger.Log(
            LogLevel.Information,
            JsonConvert.SerializeObject(fieldDeltaObj, Formatting.Indented)
        );
        _logger.Log(LogLevel.Information, JsonConvert.SerializeObject(@field, Formatting.Indented));
        fieldDeltaObj.Patch(@field);
        _context.Fields.Update(@field);
        _logger.Log(LogLevel.Information, JsonConvert.SerializeObject(@field, Formatting.Indented));
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            var mess = ex.Message;
            if (FieldExists(@field.Id))
            {
                return Conflict();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Fields/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteField(Guid id)
    {
        var @field = await _context.Fields.FindAsync(id);
        if (@field == null)
        {
            return NotFound();
        }

        _context.Fields.Remove(@field);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool FieldExists(Guid id)
    {
        return _context.Fields.Any(e => e.Id == id);
    }
}
