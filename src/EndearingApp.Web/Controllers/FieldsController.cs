using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Infrastructure.Data;
using EndearingApp.Web.Models;
using Mapster;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FieldsController : ControllerBase
{
    private readonly AppDbContext _context;

    public FieldsController(AppDbContext context)
    {
        _context = context;
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
        _context.Fields.Add(@field.Adapt<Field>());
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
