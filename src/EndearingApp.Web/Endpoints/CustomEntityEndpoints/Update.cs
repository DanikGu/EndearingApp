using Azure;
using FastEndpoints;
using Mapster;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Exstensions;
using EndearingApp.Web.Models;

namespace EndearingApp.Web.Endpoints.CustomEntityEndpoints;

public class Update : Endpoint<CustomeEntityDTO, UpdateCustomEntityResponse>
{
    private readonly IRepository<CustomEntity> _repository;

    public Update(IRepository<CustomEntity> repository)
    {
        _repository = repository;
    }

    public override void Configure()
    {
        Put(CustomeEntityDTO.Route);
        AllowAnonymous();
        //AllowFormData();
        //RequestBinder(new MvcModelBinderForForms<CustomeEntityDTO>());
    }

    public override async Task HandleAsync(
        CustomeEntityDTO request,
        CancellationToken cancellationToken
    )
    {
        var updateEntity = request.Adapt<CustomEntity>();
        var existingEntity = await _repository.FirstOrDefaultAsync(
            new GetByNameSpec(updateEntity.Name)
        );
        if (existingEntity is null)
        {
            await SendNotFoundAsync(cancellation: cancellationToken);
            return;
        }
        existingEntity.UpdateCustomeEntity(updateEntity);
        await _repository.UpdateAsync(existingEntity);
        await SendOkAsync(new UpdateCustomEntityResponse(), cancellation: cancellationToken);
    }
}
