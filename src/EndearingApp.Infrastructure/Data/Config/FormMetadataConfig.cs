using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EndearingApp.Core.CustomEntityAggregate;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace EndearingApp.Infrastructure.Data.Config;
public class FormMetadataConfig : IEntityTypeConfiguration<FormMetadata>
{
    public void Configure(EntityTypeBuilder<FormMetadata> builder)
    {
        builder.ToTable("FormMetadata", "customization");
    }
}
