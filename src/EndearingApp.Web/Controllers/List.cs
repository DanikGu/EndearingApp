using System.Linq.Expressions;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomDataAccsess.Services;
using EndearingApp.Web.Endpoints.OdataApi;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Extensions;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
namespace EndearingApp.Web.Controllers;
public class List : ODataController
{
    private readonly ICustomEntityDataProvider _customEntityQueryableProvider;

    public List(ICustomEntityDataProvider customEntityQueryableProvider, IEdmModelManager edmModelManager)
    {
        _customEntityQueryableProvider = customEntityQueryableProvider;
    }
    [EnableQuery]
    public IActionResult Get(string entityset)
    {
        var dbSet = _customEntityQueryableProvider.GetDbSet(entityset);
        return Ok(dbSet);
    }
    public IActionResult Get(string entityset, string key)
    {
        var expand = Request.ODataFeature().SelectExpandClause;
        var obj = _customEntityQueryableProvider.GetByKey(entityset, key);
        if (obj is null) 
        {
            return NotFound();
        }
        return Ok(obj);
    }

}
