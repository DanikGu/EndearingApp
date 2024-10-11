using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using EndearingApp.Core.CustomEntityAggregate.DbStructureModels;

namespace EndearingApp.Core.CustomEntityAggregate;
[DataContract]
public class Field
{
    public Field()
    {
    }
    public Guid Id { get; set; } = Guid.NewGuid();
    [DataMember]
    public string? Name { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Metadata { get; set; } = "{}";
    [DataMember]
    public SystemTypesEnum Type { get; set; }
    [DataMember]
    public int? Size { get; set; }
    [DataMember]
    public bool IsPrimaryKey { get; set; }
    [ForeignKey("CustomEntity")]
    public Guid CustomEntityId { get; set; }
    public CustomEntity? CustomEntity { get; set; } = null;
    public List<Relationship> ReferencedRelationshipToThis { get; set; } = new List<Relationship>();
    public List<Relationship> SourcedRelationshipByThis { get; set; } = new List<Relationship>();
    public Guid? OptionSetDefinitionId { get; set; }
    public OptionSetDefinition? OptionSetDefinition { get; set; } 
    
}

