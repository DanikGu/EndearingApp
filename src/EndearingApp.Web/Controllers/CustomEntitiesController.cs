using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Infrastructure.Data;
using EndearingApp.Web.Models;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace EndearingApp.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CustomEntitiesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<CustomEntitiesController> _logger;

    public CustomEntitiesController(AppDbContext context, ILogger<CustomEntitiesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/CustomEntities
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomeEntityDTO>>> GetCustomEntities()
    {
        var result = await _context
            .CustomEntities.Include(x => x.Fields)
            .Include(x => x.Relationships)
            .ToListAsync();
        var dtos = result.Select(x => x.Adapt<CustomeEntityDTO>()).ToList();
        return dtos;
    }

    // GET: api/CustomEntities/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomeEntityDTO>> GetCustomEntity(Guid id)
    {
        var customEntity = await _context.CustomEntities.FindAsync(id);

        if (customEntity == null)
        {
            return NotFound();
        }

        return customEntity.Adapt<CustomeEntityDTO>();
    }

    // PUT: api/CustomEntities/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCustomEntity(Guid id, CustomeEntityDTO customEntityDto)
    {
        if (id != customEntityDto.Id)
        {
            return BadRequest();
        }
        var customEntity = customEntityDto.Adapt<CustomEntity>();

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
    public async Task<ActionResult<CustomeEntityDTO>> PostCustomEntity(
        CustomeEntityDTO customEntity
    )
    {
        var etn = customEntity.Adapt<CustomEntity>();
        etn.AddCreateEvent();
        _context.CustomEntities.Add(etn);
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
