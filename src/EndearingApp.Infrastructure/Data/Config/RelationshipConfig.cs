using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using EndearingApp.Core.CustomEntityAggregate;

namespace EndearingApp.Infrastructure.Data.Config;

public class RelationshipConfig : IEntityTypeConfiguration<Relationship>
{
    public void Configure(EntityTypeBuilder<Relationship> builder)
    {
        builder.ToTable("Relationship", "customization");
        builder
            .Property(p => p.ConstraintName)
            .HasMaxLength(DataSchemaConstants.DEFAULT_NAME_LENGTH)
            .IsRequired();

        builder.Property(p => p.Id).ValueGeneratedNever();
        builder.HasKey(p => p.Id);
    }
}
