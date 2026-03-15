using System.Buffers;
using EndearingApp.SharedKernel;
using EndearingApp.SharedKernel.Interfaces;

namespace EndearingApp.Core.MigrationHistoryAggregate;

public class MigrationHistory: EntityBase, IAggregateRoot
{
    public string Name { get; set; } = string.Empty;
    public string MigrationContent { get; set; } = string.Empty;
    public string MigrationDesignerContent { get; set; } = string.Empty;
    public string SnapshotContent { get; set; } = string.Empty;
    public DateTimeOffset CreatedOn { get; set; } = DateTimeOffset.UtcNow;
}
