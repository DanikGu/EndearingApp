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
public class RelationshipsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<RelationshipsController> _logger;

    public RelationshipsController(AppDbContext context, ILogger<RelationshipsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/Relationships
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RelationshipDTO>>> GetRelationships()
    {
        var entities = await _context.Relationships.ToListAsync();
        return entities.Select(x => x.Adapt<RelationshipDTO>()).ToList();
    }

    // GET: api/Relationships/5
    [HttpGet("{id}")]
    public async Task<ActionResult<RelationshipDTO>> GetRelationship(Guid id)
    {
        var relationship = await _context.Relationships.FindAsync(id);

        if (relationship == null)
        {
            return NotFound();
        }

        return relationship.Adapt<RelationshipDTO>();
    }

    // PUT: api/Relationships/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutRelationship(Guid id, RelationshipDTO relationshipDto)
    {
        if (id != relationshipDto.Id)
        {
            return BadRequest();
        }
        var relationship = relationshipDto.Adapt<Relationship>();
        _context.Entry(relationship).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!RelationshipExists(id))
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

    // POST: api/Relationships
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<RelationshipDTO>> PostRelationship(RelationshipDTO relationship)
    {
        _logger.LogInformation(JsonConvert.SerializeObject(relationship, Formatting.Indented));
        var etn = relationship.Adapt<Relationship>();
        _logger.LogInformation(JsonConvert.SerializeObject(etn, Formatting.Indented));
        _context.Relationships.Add(etn);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            if (RelationshipExists(relationship.Id))
            {
                return Conflict();
            }
            else
            {
                throw;
            }
        }

        return CreatedAtAction("GetRelationship", new { id = relationship.Id }, relationship);
    }

    // DELETE: api/Relationships/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRelationship(Guid id)
    {
        var relationship = await _context.Relationships.FindAsync(id);
        if (relationship == null)
        {
            return NotFound();
        }

        _context.Relationships.Remove(relationship);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool RelationshipExists(Guid id)
    {
        return _context.Relationships.Any(e => e.Id == id);
    }
}
