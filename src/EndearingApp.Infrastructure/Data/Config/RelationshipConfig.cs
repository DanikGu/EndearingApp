using EndearingApp.Core.CustomEntityAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

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
        builder.HasIndex(x => x.ConstraintName).IsUnique();
    }
}
