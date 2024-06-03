using FastEndpoints;
using Mapster;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Models;

namespace EndearingApp.Web.Endpoints.CustomEntityEndpoints;

public class ListAll(IRepository<CustomEntity> repository) : Endpoint<EmptyRequest, List<CustomeEntityDTO>>
{
  private readonly IRepository<CustomEntity> _repository = repository;

  public override void Configure()
  {
    Get(CustomeEntityDTO.Route);
    AllowAnonymous();
  }
  public override async Task HandleAsync(EmptyRequest request, CancellationToken cancellationToken)
  {
    var entitites = await _repository.ListAsync(new GetAllSpec(), cancellationToken);
    var responseEntities = entitites.Adapt<List<CustomeEntityDTO>>();
    await SendAsync(responseEntities, cancellation: cancellationToken);
  }
}
