using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.SystemSettings;

namespace EndearingApp.Infrastructure.Data.Config;

public class SystemSettingConfig : IEntityTypeConfiguration<SystemSetting>
{
    public void Configure(EntityTypeBuilder<SystemSetting> builder)
    {
        builder.ToTable("SystemSetting", "customization");
        builder
            .Property(p => p.Name)
            .HasMaxLength(DataSchemaConstants.DEFAULT_NAME_LENGTH)
            .IsRequired();
        builder.HasKey(p => p.Id);
        builder.Property(x => x.JsonSetting).HasColumnType("jsonb");
    }
}
