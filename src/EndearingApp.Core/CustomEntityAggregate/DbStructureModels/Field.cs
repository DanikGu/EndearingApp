using System.Runtime.Serialization;

namespace EndearingApp.Core.CustomEntityAggregate.DbStructureModels;

[DataContract]
public class Field
{
    [DataMember]
    public string? Name { get; set; }
    [DataMember]
    public SystemTypesEnum Type { get; set; }
    [DataMember]
    public int? Size { get; set; }
    [DataMember]
    public bool IsPrimaryKey { get; set; }
    [DataMember]
    public bool IsRequired { get; set; }
    [DataMember]
    public string? DefaultValue { get; set; }
    [DataMember]
    public bool IsIndexed { get; set; }
    [DataMember]
    public bool IsUnique { get; set; }

}
