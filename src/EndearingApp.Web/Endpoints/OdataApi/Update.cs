using FastEndpoints;
using Microsoft.OData.Edm;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomDataAccsess.Services;

namespace EndearingApp.Web.Endpoints.OdataApi;

public class Update : Endpoint<UpdateRequest, EmptyResponse>
{
    private CustomDataCrudService _crudService;
    private readonly IEdmModelManager _manager;

    public Update(CustomDataCrudService crudService, IEdmModelManager manager)
    {
        _crudService = crudService;
        _manager = manager;
    }

    public override void Configure()
    {
        Verbs(Http.PUT, Http.PATCH);
        Routes(OdataConstants.OdataRoute + "{TableName}({Id})");
        AllowAnonymous();
    }

    public override async Task HandleAsync(
        UpdateRequest request,
        CancellationToken cancellationToken
    )
    {
        request.TableName = Route<string>("TableName");
        request.Id = Route<string>("Id");
        if (request.TableName is null)
        {
            await SendAsync(new EmptyResponse(), 400);
            return;
        }
        var edmModel = _manager.GetModel();
        var edmNamespace = edmModel.DeclaredNamespaces.FirstOrDefault();
        var key = (
            edmModel.FindDeclaredType(edmNamespace + "." + request.TableName) as EdmEntityType
        )
            .Key()
            .FirstOrDefault();
        if (key is null)
        {
            await SendAsync(new EmptyResponse(), 400);
            return;
        }
        if (int.TryParse(request.Id, out int intId))
        {
            await _crudService.Update(request.TableName, key.Name, intId, request);
            await SendNoContentAsync();
            return;
        }
        else if (Guid.TryParse(request.Id, out Guid GuidId))
        {
            await _crudService.Update(request.TableName, key.Name, GuidId, request);
            await SendNoContentAsync();
            return;
        }
        else
        {
            await SendAsync(new EmptyResponse(), 400);
            return;
        }
    }
}
