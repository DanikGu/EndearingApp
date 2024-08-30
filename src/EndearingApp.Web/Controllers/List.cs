using System.Linq.Expressions;
using System.Reflection;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomDataAccsess.Services;
using EndearingApp.Web.Endpoints.OdataApi;
using EndearingApp.Web.ViewModels;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Extensions;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;
namespace EndearingApp.Web.Controllers;
public class List : ODataController
{
    private readonly ICustomEntityQueryProvider _customEntityQueryableProvider;

    public List(ICustomEntityQueryProvider customEntityQueryableProvider)
    {
        _customEntityQueryableProvider = customEntityQueryableProvider;
    }
    [EnableQuery]
    public IActionResult Get(string entityset)
    {
        var dbSet = _customEntityQueryableProvider.GetDbSet(entityset);
        return Ok(dbSet);
    }
    [EnableQuery]
    public IActionResult Get(string entityset, string key)
    {
        var query = _customEntityQueryableProvider.GetByKey(entityset, key);
        return Ok(GetSingleResult(query));
    }

    private SingleResult GetSingleResult(IQueryable queryable) 
    {
        var modelType = GetTableModelType(queryable);
        MethodInfo MI = typeof(SingleResult).GetMethod("Create")!;
        MethodInfo genericMethod = MI.MakeGenericMethod(new[] { modelType });
        var result = genericMethod.Invoke(null, new[] { queryable });
        return (result as SingleResult)!;
    }
    private Type GetTableModelType(IQueryable queryable)
    {
        return queryable.GetType().GenericTypeArguments[0];
    }


}
