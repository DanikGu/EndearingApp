using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EndearingApp.Core.CustomEntityAggregate;

namespace EndearingApp.Infrastructure.Data.Config;

public class OptionConfig : IEntityTypeConfiguration<Option>
{
    public void Configure(EntityTypeBuilder<Option> builder)
    {
        builder.ToTable("Option", "customization");
    }
}
