using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using EndearingApp.Core.CustomEntityAggregate;

namespace EndearingApp.Infrastructure.Data.Config;

public class FieldConfig : IEntityTypeConfiguration<Field>
{
    public void Configure(EntityTypeBuilder<Field> builder)
    {
        builder.ToTable("Field", "customization");
        builder
            .Property(p => p.Name)
            .HasMaxLength(DataSchemaConstants.DEFAULT_NAME_LENGTH)
            .IsRequired();
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).ValueGeneratedNever();
        builder.HasIndex(u => new { u.Name, u.CustomEntityId }).IsUnique();

        builder
            .HasMany(x => x.SourcedRelationshipByThis)
            .WithOne(x => x.SourceField)
            .OnDelete(DeleteBehavior.Cascade);
        builder
            .HasMany(x => x.ReferencedRelationshipToThis)
            .WithOne(x => x.ReferencedField)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Metadata).HasColumnType("jsonb");
    }
}
