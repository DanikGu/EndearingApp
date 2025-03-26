using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using EndearingApp.Core.CustomEntityAggregate.DbStructureModels;
using EndearingApp.Core.OptionSetDefinitionAggregate;

namespace EndearingApp.Core.CustomEntityAggregate;

public class Field
{
    public Field() { }

    public Guid Id { get; set; } = Guid.CreateVersion7();

    public string? Name { get; set; }

    public string DisplayName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Metadata { get; set; } = "{}";

    public SystemTypesEnum Type { get; set; }

    public int? Size { get; set; }

    public bool IsPrimaryKey { get; set; }
    public bool IsNullable { get; set; } = true;
    public bool IsIndexed { get; set; }
    public bool IsUnique { get; set; }
    public bool IsRequired { get; set; }
    public bool IsSystemField { get; set; } = false;
    public bool IsFullTextSearch { get; set; } = false;

    [ForeignKey("CustomEntity")]
    public Guid CustomEntityId { get; set; }

    public CustomEntity? CustomEntity { get; set; } = null;

    public List<Relationship> ReferencedRelationshipToThis { get; set; } = new List<Relationship>();

    public List<Relationship> SourcedRelationshipByThis { get; set; } = new List<Relationship>();
    public Guid? OptionSetDefinitionId { get; set; }

    public OptionSetDefinition? OptionSetDefinition { get; set; }
}
