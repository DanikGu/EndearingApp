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
    [DataMember]
    public string DisplayName { get; set; } = string.Empty;
    [DataMember]
    public string Description { get; set; } = string.Empty;
    [DataMember]
    public string Metadata { get; set; } = "{}";
    [DataMember]
    public SystemTypesEnum Type { get; set; }
    [DataMember]
    public int? Size { get; set; }
    [DataMember]
    public bool IsPrimaryKey { get; set; }
    public bool IsNullable { get; set; } = true;
    public bool IsIndexed { get; set; }
    public bool IsUnique { get; set; }
    public bool IsRequired { get; set; }
    [ForeignKey("CustomEntity")]
    public Guid CustomEntityId { get; set; }
    [DataMember]
    public CustomEntity? CustomEntity { get; set; } = null;
    [DataMember]
    public List<Relationship> ReferencedRelationshipToThis { get; set; } = new List<Relationship>();
    [DataMember]
    public List<Relationship> SourcedRelationshipByThis { get; set; } = new List<Relationship>();
    public Guid? OptionSetDefinitionId { get; set; }
    [DataMember]
    public OptionSetDefinition? OptionSetDefinition { get; set; } 
    
}

