using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using EndearingApp.Core.CustomEntityAggregate.Events;
using EndearingApp.SharedKernel;
using EndearingApp.SharedKernel.Interfaces;

namespace EndearingApp.Core.CustomEntityAggregate;

[DataContract]
public class CustomEntity : EntityBase, IAggregateRoot
{
    public CustomEntity()
    {
        RegisterDomainEvent(new CustomDbStructureChangedEvent());
    }

    public CustomEntity(Guid id, string name, List<Field> fields, List<Relationship> relationships)
    {
        Id = id;
        Name = name;
        _fields = fields;
        _relationships = relationships;
    }

    [DataMember]
    public string Name { get; set; } = "";

    [DataMember]
    private List<Field> _fields = new List<Field>();
    public IReadOnlyCollection<Field> Fields => _fields;

    [DataMember]
    private List<Relationship> _relationships = new List<Relationship>();
    public IReadOnlyCollection<Relationship> Relationships => _relationships;

    public void UpdateCustomeEntity(CustomEntity customEntity)
    {
        Name = customEntity.Name;
        _fields = customEntity._fields;
        _relationships = customEntity._relationships;
    }
}
