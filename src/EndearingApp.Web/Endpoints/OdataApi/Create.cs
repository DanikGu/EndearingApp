using FastEndpoints;
using Microsoft.AspNetCore.Http.Extensions;
using EndearingApp.Core.CustomDataAccsess.Services;

namespace EndearingApp.Web.Endpoints.OdataApi;

public class Create : Endpoint<CreateRequest, EmptyResponse>
{
    private readonly CustomDataCrudService _crudService;

    public Create(CustomDataCrudService crudService)
    {
        _crudService = crudService;
    }

    public override void Configure()
    {
        Post(OdataConstants.OdataRoute + "{TableName}");
        AllowAnonymous();
    }

    public override async Task HandleAsync(
        CreateRequest request,
        CancellationToken cancellationToken
    )
    {
        request.TableName = Route<string>("TableName");
        if (request?.TableName is null)
        {
            await SendAsync(new EmptyResponse(), 400);
            return;
        }
        await _crudService.Create(request.TableName!, request);
        await SendNoContentAsync();
    }
}
