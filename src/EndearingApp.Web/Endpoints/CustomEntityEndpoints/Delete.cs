using Ardalis.Result;
using Azure;
using FastEndpoints;
using Mapster;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.SharedKernel.Interfaces;

namespace EndearingApp.Web.Endpoints.CustomEntityEndpoints;

public class Delete : Endpoint<DeleteCustomEntityRequest, DeleteCustomEntityResponse>
{
    private readonly IRepository<CustomEntity> _repository;

    public Delete(IRepository<CustomEntity> repository)
    {
        _repository = repository;
    }

    public override void Configure()
    {
        Delete(DeleteCustomEntityRequest.Route);
        AllowAnonymous();
    }

    public override async Task HandleAsync(
        DeleteCustomEntityRequest request,
        CancellationToken cancellationToken
    )
    {
        var entity = await _repository.FirstOrDefaultAsync(new GetByNameSpec(request.Name));
        if (entity is null)
        {
            await SendNotFoundAsync();
            return;
        }
        await _repository.DeleteAsync(entity);
        await SendOkAsync(new DeleteCustomEntityResponse(), cancellation: cancellationToken);
    }
}
