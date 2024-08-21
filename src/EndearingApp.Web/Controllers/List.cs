using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomDataAccsess.Services;
using EndearingApp.Web.Endpoints.OdataApi;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.OData.UriParser;
namespace EndearingApp.Web.Controllers;
public class List : Controller
{
    private readonly ICustomEntityQueryDataProvider _customEntityQueryableProvider;
    private readonly IEdmModelManager _edmModelManager;

    public List(ICustomEntityQueryDataProvider customEntityQueryableProvider, IEdmModelManager edmModelManager)
    {
        _customEntityQueryableProvider = customEntityQueryableProvider;
        _edmModelManager = edmModelManager;
    }
    [EnableQuery]
    [HttpGet("odata/{*any}")]
    public IActionResult Get()
    {
        var fullUrl = HttpContext.Request.GetDisplayUrl();
        var relativeUrlStartIndex =
            fullUrl.IndexOf(OdataConstants.OdataRoute) + OdataConstants.OdataRoute.Length;
        var relativeUri = new Uri(fullUrl.Substring(relativeUrlStartIndex), UriKind.Relative);
        var parser = GetParser(relativeUri);

        var paths = parser.ParsePath().ToList();
        var entitySetSegment = paths.FirstOrDefault(x => x is EntitySetSegment);
        var dbSet = _customEntityQueryableProvider.GetDbSet(entitySetSegment!.Identifier);
        
        return Ok(dbSet);
    }
    private ODataUriParser GetParser(Uri relativeUri)
    {
        var parser = new ODataUriParser(_edmModelManager.GetModel(), relativeUri);
        parser.Resolver.EnableCaseInsensitive = true;
        parser.Resolver.EnableNoDollarQueryOptions = true;
        return parser;
    }
}
