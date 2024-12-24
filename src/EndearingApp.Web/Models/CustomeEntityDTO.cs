using System.Runtime.Serialization;
using EndearingApp.Core.CustomEntityAggregate;
using Mapster;

namespace EndearingApp.Web.Models;

public class CustomeEntityDTO : BaseDto<CustomeEntityDTO, CustomEntity>
{
    public CustomeEntityDTO() { }

    public const string Route = "/CustomEntity";
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Name { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Metadata { get; set; } = "{}";
    public List<FieldDto> Fields { get; set; } = new List<FieldDto>();
    public List<RelationshipDTO> Relationships { get; set; } = new List<RelationshipDTO>();

    public override void AddCustomMappings()
    {
        SetCustomMappings()
            .MapWith(x => new CustomEntity(
                x.Id,
                x.Name ?? "",
                x.Fields.Select(x => x.Adapt<Field>()).ToList(),
                x.Relationships.Select(y => y.ToEntity()).ToList()
            )
            {
                DisplayName = x.DisplayName,
                Description = x.Description,
            });
    }
}

public class FieldDto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CustomEntityId { get; set; } = Guid.Empty;
    public string? Name { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Metadata { get; set; } = "{}";
    public int Type { get; set; } = -1;
    public int? Size { get; set; }
    public bool IsPrimaryKey { get; set; }
    public bool IsNullable { get; set; } = true;
    public bool IsSystemField { get; set; } = true;
    public bool IsIndexed { get; set; }
    public bool IsUnique { get; set; }
    public bool IsRequired { get; set; }
    public Guid? OptionSetDefinitionId { get; set; }
}

public class RelationshipDTO : BaseDto<RelationshipDTO, Relationship>
{
    public override void AddCustomMappings()
    {
        SetCustomMappings()
            .MapWith(x => new Relationship(
                x.Id,
                x.SourceCustomEntityId,
                x.SourceFieldId,
                x.ReferencedCustomEntityId,
                x.ReferencedFieldId,
                x.ConstraintName
            ));
    }

    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SourceCustomEntityId { get; set; }
    public Guid SourceFieldId { get; set; }
    public Guid ReferencedFieldId { get; set; }
    public Guid ReferencedCustomEntityId { get; set; }
    public string ConstraintName { get; set; } = "";
}
