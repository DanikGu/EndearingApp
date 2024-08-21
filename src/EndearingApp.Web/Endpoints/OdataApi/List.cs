using System.Dynamic;
using FastEndpoints;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomDataAccsess.Services;
using EndearingApp.SharedKernel.Interfaces;
using static System.Net.Mime.MediaTypeNames;
using EndearingApp.Infrastructure.Data.CustomDataAccess;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.OData.UriParser;
using Microsoft.AspNetCore.Mvc.Abstractions;
using System.Reflection;
using Microsoft.AspNetCore.OData;

namespace EndearingApp.Web.Endpoints.OdataApi;

//public class List : Endpoint<EmptyRequest, object>
//{
//    private readonly CustomDataCrudService _crudService;
//    private readonly ICustomEntityQueryableProvider _customEntityQueryableProvider;
//    private readonly IEdmModelManager _edmModelManager;
//
//    public List(CustomDataCrudService crudService, ICustomEntityQueryableProvider customEntityQueryableProvider,
//        IEdmModelManager edmModelManager)
//    {
//        _crudService = crudService;
//        _customEntityQueryableProvider = customEntityQueryableProvider;
//        _edmModelManager = edmModelManager;
//    }
//
//    public override void Configure()
//    {
//        Get("");
//        AllowAnonymous();
//    }
//
//    public override async Task HandleAsync(
//        EmptyRequest request,
//        CancellationToken cancellationToken
//    )
//    {
//
//        await Task.CompletedTask;
//        //await SendOkAsync(result);
//    }
//    public object GetResultObject(HttpContext context, Uri relativeUrl)
//    {
//        var parser = GetParser(relativeUrl);
//        
//        var paths = parser.ParsePath().ToList();
//        var entitySetSegment = paths.FirstOrDefault(x => x is EntitySetSegment);
//        var actionContext = new ActionContext() { 
//            ActionDescriptor = new ControllerActionDescriptor()
//            {
//                ControllerTypeInfo = this.GetType().GetTypeInfo(),
//                MethodInfo = this!.GetType()!.GetMethod("Mock")!
//            },
//            RouteData = new RouteData(),
//            HttpContext = context ,
//        };
//        var actionExecutedContext = new ActionExecutedContext(actionContext, new List<IFilterMetadata>(), new object());
//        actionExecutedContext.HttpContext = context;
//        
//        var dbSet = _customEntityQueryableProvider.GetDbSet(entitySetSegment!.Identifier);
//        actionExecutedContext.Result = new OkObjectResult(dbSet);
//        var options = new ODataOptions();
//        options.AddRouteComponents(_edmModelManager.GetModel());
//        var queryAttribute = new EnableQueryAttribute() {
//            
//            AllowedQueryOptions = AllowedQueryOptions.All,
//            AllowedArithmeticOperators = AllowedArithmeticOperators.All,
//            AllowedFunctions = AllowedFunctions.All,
//            AllowedLogicalOperators = AllowedLogicalOperators.All,
//            AllowedOrderByProperties = null
//        };
//        queryAttribute.OnActionExecuted(actionExecutedContext);
//        
//        return (actionExecutedContext!.Result! as ObjectResult)!.Value!;
//    }
//    private ODataUriParser GetParser(Uri relativeUri)
//    {
//        var parser = new ODataUriParser(_edmModelManager.GetModel(), relativeUri);
//        parser.Resolver.EnableCaseInsensitive = true;
//        parser.Resolver.EnableNoDollarQueryOptions = true;
//        return parser;
//    }
//    public IActionResult Mock()
//    {
//        return new OkResult();
//    }
//}
