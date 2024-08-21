using FastEndpoints;
using Mapster;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Models;

namespace EndearingApp.Web.Endpoints.CustomEntityEndpoints;

public class Create : Endpoint<CustomeEntityDTO, CreateCustomEntityResponse>
{
    private readonly IRepository<CustomEntity> _repository;

    public Create(IRepository<CustomEntity> repository)
    {
        _repository = repository;
    }

    public override void Configure()
    {
        Post(CustomeEntityDTO.Route);
        AllowAnonymous();
    }

    public override async Task HandleAsync(
        CustomeEntityDTO request,
        CancellationToken cancellationToken
    )
    {
        var updateEntity = request.Adapt<CustomEntity>();
        var result = await _repository.AddAsync(updateEntity);
        await SendOkAsync(new CreateCustomEntityResponse(result.Id), cancellationToken);
    }
}
