using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using EndearingApp.Core.CustomEntityAggregate.Events;
using EndearingApp.SharedKernel;
using EndearingApp.SharedKernel.Interfaces;

namespace EndearingApp.Core.CustomEntityAggregate;

public class CustomEntity : EntityBase, IAggregateRoot
{
    public string DisplayName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Metadata { get; set; } = "{}";

    public CustomEntity() { }

    public CustomEntity(Guid id, string name, List<Field> fields, List<Relationship> relationships)
    {
        Id = id;
        Name = name;
        _fields = fields;
        _relationships = relationships;
    }

    public string Name { get; set; } = "";

    private List<Field> _fields = new List<Field>();

    public IReadOnlyCollection<Field> Fields => _fields;

    private List<Relationship> _relationships = new List<Relationship>();

    public IReadOnlyCollection<Relationship> Relationships => _relationships;

    [ForeignKey("CustomEntityMetadata")]
    public Guid? CustomEntityMetadataId { get; set; }

    public void UpdateCustomeEntity(CustomEntity customEntity)
    {
        Name = customEntity.Name;
        _fields = customEntity._fields;
        _relationships = customEntity._relationships;
    }

    public void AddCreateEvent()
    {
        RegisterDomainEvent(new CustomEntityCreated() { Id = Id });
    }   
}
