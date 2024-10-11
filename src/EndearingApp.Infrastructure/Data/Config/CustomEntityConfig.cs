using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EndearingApp.Core.CustomEntityAggregate;

namespace EndearingApp.Infrastructure.Data.Config;

public class CustomEntityConfig : IEntityTypeConfiguration<CustomEntity>
{
    public void Configure(EntityTypeBuilder<CustomEntity> builder)
    {
        builder.ToTable("CustomEntity", "customization");
        builder
            .Property(p => p.Name)
            .HasMaxLength(DataSchemaConstants.DEFAULT_NAME_LENGTH)
            .IsRequired();
        builder.HasKey(p => p.Id);
        builder.HasIndex(u => u.Name).IsUnique();

        builder
            .HasMany(x => x.Relationships)
            .WithOne(x => x.SourceCustomEntity)
            .OnDelete(DeleteBehavior.Cascade);
        builder
            .HasMany(x => x.Fields)
            .WithOne(x => x.CustomEntity)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Metadata).HasColumnType("jsonb");
    }
}
