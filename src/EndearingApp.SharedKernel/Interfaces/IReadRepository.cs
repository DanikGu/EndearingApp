using Ardalis.Specification;

namespace EndearingApp.SharedKernel.Interfaces;

public interface IReadRepository<T> : IReadRepositoryBase<T> where T : class, IAggregateRoot { }
