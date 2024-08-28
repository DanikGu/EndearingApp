using FastEndpoints;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Endpoints.CustomEntityEndpoints;
using EndearingApp.Web.Models;

namespace EndearingApp.Web.Endpoints.OdataApi;

//public class Metadata : Endpoint<EmptyRequest, string>
//{
//    private readonly IEdmModelManager _manager;
//
//    public Metadata(IEdmModelManager manager)
//    {
//        _manager = manager;
//    }
//
//    public override void Configure()
//    {
//        Get(OdataConstants.OdataRoute + "$metadata");
//        AllowAnonymous();
//    }
//
//    public override async Task HandleAsync(
//        EmptyRequest request,
//        CancellationToken cancellationToken
//    )
//    {
//        string metadata = _manager.GetXmlModel();
//        await SendStringAsync(metadata, contentType: "application/xhtml+xml");
//    }
//}
//
