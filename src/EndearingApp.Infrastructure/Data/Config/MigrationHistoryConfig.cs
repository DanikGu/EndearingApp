using EndearingApp.Core.MigrationHistoryAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EndearingApp.Infrastructure.Data.Config;

public class MigrationHistoryConfig:  IEntityTypeConfiguration<MigrationHistory>
{
    public void Configure(EntityTypeBuilder<MigrationHistory> builder)
    {
        builder.ToTable("MigrationHistory", "customization");
        builder.Property(x => x.MigrationContent).HasColumnType("text");
    }
}
