using System.Dynamic;
using Azure.Core;
using FastEndpoints;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomDataAccsess.Services;
using EndearingApp.SharedKernel.Interfaces;
using static System.Net.Mime.MediaTypeNames;

namespace EndearingApp.Web.Endpoints.OdataApi;

public class List : Endpoint<EmptyRequest, IEnumerable<dynamic>>
{
    private readonly CustomDataCrudService _crudService;

    public List(CustomDataCrudService crudService)
    {
        _crudService = crudService;
    }

    public override void Configure()
    {
        Get(OdataConstants.OdataRoute + "{*any}");
        AllowAnonymous();
    }

    public override async Task HandleAsync(
        EmptyRequest request,
        CancellationToken cancellationToken
    )
    {
        var fullUrl = HttpContext.Request.GetDisplayUrl();
        var relativeUrlStartIndex =
            fullUrl.IndexOf(OdataConstants.OdataRoute) + OdataConstants.OdataRoute.Length;
        var relativeUri = new Uri(fullUrl.Substring(relativeUrlStartIndex), UriKind.Relative);
        var result = await _crudService.List<dynamic>(relativeUri);
        await SendOkAsync(result);
    }
}
