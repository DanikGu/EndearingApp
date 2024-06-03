using MediatR;

namespace EndearingApp.SharedKernel;

public abstract class DomainEventBase : INotification
{
    public DateTime DateOccurred { get; protected set; } = DateTime.UtcNow;
}
