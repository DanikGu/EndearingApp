using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Infrastructure.Data;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CustomEntitiesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomEntitiesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/CustomEntities
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomEntity>>> GetCustomEntities()
    {
        return await _context.CustomEntities.ToListAsync();
    }

    // GET: api/CustomEntities/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomEntity>> GetCustomEntity(Guid id)
    {
        var customEntity = await _context.CustomEntities.FindAsync(id);

        if (customEntity == null)
        {
            return NotFound();
        }

        return customEntity;
    }

    // PUT: api/CustomEntities/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCustomEntity(Guid id, CustomEntity customEntity)
    {
        if (id != customEntity.Id)
        {
            return BadRequest();
        }

        _context.Entry(customEntity).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CustomEntityExists(id))
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

    // POST: api/CustomEntities
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<CustomEntity>> PostCustomEntity(CustomEntity customEntity)
    {
        _context.CustomEntities.Add(customEntity);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetCustomEntity", new { id = customEntity.Id }, customEntity);
    }

    // DELETE: api/CustomEntities/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomEntity(Guid id)
    {
        var customEntity = await _context.CustomEntities.FindAsync(id);
        if (customEntity == null)
        {
            return NotFound();
        }

        _context.CustomEntities.Remove(customEntity);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CustomEntityExists(Guid id)
    {
        return _context.CustomEntities.Any(e => e.Id == id);
    }
}
