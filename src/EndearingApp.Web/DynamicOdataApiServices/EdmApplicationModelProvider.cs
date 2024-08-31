using EndearingApp.Core.CustomDataAccsess.Interfaces;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.Batch;
using Microsoft.AspNetCore.OData.Extensions;
using Microsoft.AspNetCore.OData.Routing.Template;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Options;
using Microsoft.OData.Edm;
namespace EndearingApp.Web.DynamicOdataApiServices;

public partial class EdmApplicationModelProvider : IApplicationModelProvider
{
    const string prefix = OdataConstants.OdataRoute;
    public EdmApplicationModelProvider(IOptions<ODataOptions> options)
    {
        options.Value.AddRouteComponents(prefix, EdmCoreModel.Instance, new DefaultODataBatchHandler());
    }

    /// <summary>
    /// Gets the order value for determining the order of execution of providers.
    /// </summary>
    public int Order => 90;

    public void OnProvidersExecuted(ApplicationModelProviderContext context)
    {
        var model = new EdmModel();
        
        foreach (var controllerModel in context.Result.Controllers)
        {
            if (controllerModel.ControllerName == "CrudOdata")
            {
                ProcessHandleAll("odata", model, controllerModel);
                continue;
            }

            if (controllerModel.ControllerName == "Metadata")
            {
                ProcessMetadata("odata", model, controllerModel);
                continue;
            }
        }
    }

    public void OnProvidersExecuting(ApplicationModelProviderContext context)
    {
    }

    private void ProcessHandleAll(string prefix, IEdmModel model, ControllerModel controllerModel)
    {
        foreach (var actionModel in controllerModel.Actions)
        {
            if (actionModel.ActionName == "Get")
            {
                if (actionModel.Parameters.Count == 1)
                {
                    ODataPathTemplate path = new ODataPathTemplate(new EntitySetTemplateSegment());
                    actionModel.AddSelector("get", prefix, model, path);
                }
                else
                {
                    ODataPathTemplate path = new ODataPathTemplate(
                        new EntitySetWithKeyTemplateSegment());
                    actionModel.AddSelector("get", prefix, model, path);
                }
            }
            else if (actionModel.ActionName == "Create")
            {
                ODataPathTemplate path = new ODataPathTemplate(
                        new EntitySetTemplateSegment());
                actionModel.AddSelector("post", prefix, model, path);
            }
            else if (actionModel.ActionName == "Patch")
            {
                ODataPathTemplate path = new ODataPathTemplate(
                        new EntitySetWithKeyTemplateSegment());
                actionModel.AddSelector("patch", prefix, model, path);
            }
            else if (actionModel.ActionName == "Update")
            {
                ODataPathTemplate path = new ODataPathTemplate(
                        new EntitySetWithKeyTemplateSegment());
                actionModel.AddSelector("put", prefix, model, path);
            }
            else if (actionModel.ActionName == "Delete")
            {
                ODataPathTemplate path = new ODataPathTemplate(
                        new EntitySetWithKeyTemplateSegment());
                actionModel.AddSelector("delete", prefix, model, path);
            }
        }
    }

    private void ProcessMetadata(string prefix, IEdmModel model, ControllerModel controllerModel)
    {
        foreach (var actionModel in controllerModel.Actions)
        {
            if (actionModel.ActionName == "GetMetadata")
            {
                var path = new ODataPathTemplate(MetadataSegmentTemplate.Instance);
                actionModel.AddSelector("get", prefix, model, path);
            }
            else if (actionModel.ActionName == "GetServiceDocument")
            {
                var path = new ODataPathTemplate();
                actionModel.AddSelector("get", prefix, model, path);
            }
        }
    }
}
