using EndearingApp.SharedKernel;

namespace EndearingApp.Core.CustomEntityAggregate.Events
{
    public class CustomEntityCreated : DomainEventBase
    {
        public Guid Id { get; set; }
    }
}
