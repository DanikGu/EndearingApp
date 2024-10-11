using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EndearingApp.Core.CustomEntityAggregate;

namespace EndearingApp.Infrastructure.Data.Config;

public class OptionSetDefinitionConfig : IEntityTypeConfiguration<OptionSetDefinition>
{
    public void Configure(EntityTypeBuilder<OptionSetDefinition> builder)
    {
        builder.ToTable("OptionSetDefinition", "customization");
    }
}
