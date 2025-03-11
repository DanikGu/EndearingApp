using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace EndearingApp.Core.CustomEntityAggregate;

public class Relationship
{
    public Relationship() { }

    public Relationship(
        Guid id,
        Guid sourceCustomEntityId,
        Guid sourceFieldId,
        Guid referencedCustomEntityId,
        Guid referencedFieldId,
        string constraintName
    )
    {
        this.Id = id;
        this.SourceCustomEntityId = sourceCustomEntityId;
        this.SourceFieldId = sourceFieldId;
        this.ReferencedCustomEntityId = referencedCustomEntityId;
        this.ReferencedFieldId = referencedFieldId;
        this.ConstraintName = constraintName;
    }

    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid SourceCustomEntityId { get; set; } = default(Guid);

    public CustomEntity? SourceCustomEntity { get; set; } = default;
    public Guid SourceFieldId { get; set; } = default(Guid);

    public Field? SourceField { get; set; } = default;
    public Guid ReferencedCustomEntityId { get; set; } = default(Guid);
    public CustomEntity? ReferencedCustomEntity { get; set; }
    public Guid ReferencedFieldId { get; set; } = default(Guid);
    public Field? ReferencedField { get; set; } = default;

    public string? ConstraintName { get; set; } = default;

    [NotMapped]
    public string? SourceFieldName
    {
        get => SourceField?.Name;
        set { }
    }

    [NotMapped]
    public string? ReferencedTableName
    {
        get => ReferencedCustomEntity?.Name;
        set { }
    }

    [NotMapped]
    public string? ReferencedFieldName
    {
        get => ReferencedField?.Name;
        set { }
    }
}
