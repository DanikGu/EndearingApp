
using EndearingApp.Core.FormAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EndearingApp.Infrastructure.Data.Config;
public class FormConfig : IEntityTypeConfiguration<Form>
{
    public void Configure(EntityTypeBuilder<Form> builder)
    {
        builder.ToTable("Form", "customization");
        builder
            .Property(p => p.Name)
            .HasMaxLength(DataSchemaConstants.DEFAULT_NAME_LENGTH)
            .IsRequired();
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).ValueGeneratedNever();
        builder.HasIndex(u => u.Name).IsUnique();
        builder.Property(x => x.JsonSchema).HasColumnType("jsonb");
    }
}
