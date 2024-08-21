using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using EndearingApp.Core.CustomEntityAggregate.DbStructureModels;

namespace EndearingApp.Core.CustomEntityAggregate;
[DataContract]
public class Field
{
  public Guid Id { get; set; }
  [DataMember]
  public string? Name { get; set; }
  [DataMember]
  public SystemTypesEnum Type { get; set; }
  [DataMember]
  public int? Size { get; set; }
  [DataMember]
  public bool IsPrimaryKey { get; set; }
  [ForeignKey("CustomEntity")]
  public Guid CustomEntityId { get; set; }
  public required CustomEntity CustomEntity { get; set; }
  public List<Relationship> ReferencedRelationshipToThis { get; set; } = new List<Relationship>();
  public List<Relationship> SourcedRelationshipByThis { get; set; } = new List<Relationship>();
}

