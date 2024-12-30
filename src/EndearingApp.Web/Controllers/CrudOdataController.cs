using System.Reflection;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Infrastructure.Data.CustomDataAccess;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace EndearingApp.Web.Controllers;

[ApiExplorerSettings(IgnoreApi = true)]
public class CrudOdataController : ODataController
{
    private readonly ICustomEntityQueryProvider _customEntityQueryableProvider;
    private readonly ICustomDataEditor _customDataEditor;
    private static MethodInfo SingleResultCreateMethodInfo = typeof(SingleResult).GetMethod(
        "Create"
    )!;

    public CrudOdataController(
        ICustomEntityQueryProvider customEntityQueryableProvider,
        ICustomDataEditor customDataEditor
    )
    {
        _customEntityQueryableProvider = customEntityQueryableProvider;
        _customDataEditor = customDataEditor;
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

    public async Task<IActionResult> Create(string entitySet)
    {
        var body = await GetBody();
        var created = _customDataEditor.Create(entitySet, body);
        return Created(created);
    }

    public async Task<IActionResult> Patch(string entitySet, string key)
    {
        var body = await GetBody();
        var patched = _customDataEditor.Patch(entitySet, key, body);
        return Updated(patched);
    }

    public async Task<IActionResult> Update(string entitySet, string key)
    {
        var body = await GetBody();
        var updated = _customDataEditor.Update(entitySet, key, body);
        return Updated(updated);
    }

    public IActionResult Delete(string entitySet, string key)
    {
        _customDataEditor.Delete(entitySet, key);
        return NoContent();
    }

    private async Task<string> GetBody()
    {
        using var stream = new StreamReader(Request.Body);
        var body = await stream.ReadToEndAsync();
        return body;
    }

    private SingleResult GetSingleResult(IQueryable queryable)
    {
        var modelType = Utils.GetTableModelType(queryable);
        MethodInfo genericMethod = SingleResultCreateMethodInfo.MakeGenericMethod(
            new[] { modelType }
        );
        var result = genericMethod.Invoke(null, new[] { queryable });
        return (result as SingleResult)!;
    }
}
