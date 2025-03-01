using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using Ardalis.Result;
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
        DisplayName = customEntity.DisplayName; 
        Description = customEntity.Description;
        Metadata = customEntity.Metadata;
        _fields = customEntity._fields;
        _relationships = customEntity._relationships;
    }

    public void AddCreateEvent()
    {
        RegisterDomainEvent(new CustomEntityCreated() { Id = Id });
    }
    public Result AddField(Field field)
    {
        if (_fields.Any(f => f.Id == field.Id))
        {
            return Result.NotFound("Field with such Id already exists.");
        }
        if (field.IsSystemField)
        {
            return Result.Forbidden();
        }
        _fields.Add(field);
        return Result.Success();
    }
    public Result RemoveField(Guid fieldId)
    {
        var foundedField = _fields.FirstOrDefault(f => f.Id == fieldId);
        
        if (foundedField is null)
        {
            return Result.NotFound("Field with such id does not exists.");
        }
        if (foundedField.IsSystemField)
        {
            return Result.Forbidden();
        }
        _fields.Remove(foundedField);
        return Result.Success();
    }

    public Result UpdateField(Field updatedField)
    {
        var index = _fields.FindIndex(f => f.Id == updatedField.Id);
        if (index >= 0)
        {
            if (_fields[index].IsSystemField)
            {
                return Result.Forbidden();
            }
            _fields[index] = updatedField;
            return Result.Success();
        }
        return Result.NotFound("Field with such id does not exists.");
    }
}
