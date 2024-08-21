using FastEndpoints;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.OData.Edm;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomDataAccsess.Services;

namespace EndearingApp.Web.Endpoints.OdataApi;

public class DeleteRequest
{
    public string? TableName { get; set; }
    public string? Id { get; set; }
}

public class Delete : Endpoint<DeleteRequest, EmptyResponse>
{
    private readonly CustomDataCrudService _crudService;
    private readonly IEdmModelManager _manager;

    public Delete(CustomDataCrudService crudService, IEdmModelManager manager)
    {
        _crudService = crudService;
        _manager = manager;
    }

    public override void Configure()
    {
        Delete(OdataConstants.OdataRoute + "{TableName}({Id})");
        AllowAnonymous();
    }

    public override async Task HandleAsync(
        DeleteRequest request,
        CancellationToken cancellationToken
    )
    {
        if (request.TableName is null)
        {
            await SendAsync(new EmptyResponse(), 400);
        }
        var edmModel = new EdmModel();//_manager.GetModel();
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
            await _crudService.Delete(request.TableName!, key.Name, intId);
            await SendNoContentAsync();
            return;
        }
        else if (Guid.TryParse(request.Id, out Guid GuidId))
        {
            await _crudService.Delete(request.TableName!, key.Name, GuidId);
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
