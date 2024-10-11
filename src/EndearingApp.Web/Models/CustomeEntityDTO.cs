using Mapster;
using EndearingApp.Core.CustomEntityAggregate;

namespace EndearingApp.Web.Models;

public class CustomeEntityDTO : BaseDto<CustomeEntityDTO, CustomEntity>
{
    public CustomeEntityDTO() { }

    public const string Route = "/CustomEntity";
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Name { get; set; }
    public List<FieldDto> Fields { get; set; } = new List<FieldDto>();
    public List<RelationshipDto> Relationships { get; set; } = new List<RelationshipDto>();

    public override void AddCustomMappings()
    {
        SetCustomMappings()
            .MapWith(
                x =>
                    new CustomEntity(
                        x.Id,
                        x.Name ?? "",
                        x.Fields.Select(x => x.Adapt<Field>()).ToList(),
                        x.Relationships.Select(y => y.ToEntity()).ToList()
                    )
            );
    }
}
public class CustomeEntityMetadataDto 
{

}
public class FieldDto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public int Type { get; set; } = -1;
    public int? Size { get; set; }
    public bool IsPrimaryKey { get; set; }
}

public class RelationshipDto : BaseDto<RelationshipDto, Relationship>
{
    public override void AddCustomMappings()
    {
        SetCustomMappings()
            .MapWith(
                x =>
                    new Relationship(
                        x.Id,
                        x.SourceCustomEntityId,
                        x.SourceFieldId,
                        x.ReferencedCustomEntityId,
                        x.ReferencedFieldId,
                        x.ConstraintName
                    )
            );
    }

    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SourceCustomEntityId { get; set; }
    public Guid SourceFieldId { get; set; }
    public Guid ReferencedFieldId { get; set; }
    public Guid ReferencedCustomEntityId { get; set; }
    public string ConstraintName { get; set; } = "";
}
