using System.Runtime.Serialization;

namespace EndearingApp.Core.CustomEntityAggregate.DbStructureModels;

[DataContract]
public class DbStructure
{
    [DataMember]
    public Table[]? Tables { get; set; }

    public List<Relationship>? GetAllRelationships()
    {
        return Tables?.SelectMany(x => x.Relationships).ToList();
    }
}
