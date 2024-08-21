using System.Runtime.Serialization;

namespace EndearingApp.Core.CustomEntityAggregate.DbStructureModels;

[DataContract]
public class Table
{
    [DataMember]
    public string? Name { get; set; }
    [DataMember]
    public Field[] Fields { get; set; } = new Field[0];
    [DataMember]
    public Relationship[] Relationships { get; set; } = new Relationship[0];
}
