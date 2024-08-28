using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Web.Endpoints.OdataApi;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.Extensions;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Routing;
using Microsoft.AspNetCore.OData.Routing.Template;
using Microsoft.Extensions.Options;
using Microsoft.OData;
using Microsoft.OData.Edm;
using Microsoft.OData.UriParser;
namespace EndearingApp.Web.DynamicOdataApiServices;

public class EdmApplicationModelProvider : IApplicationModelProvider
{
    private readonly IEdmModelManager _modelManager;
    const string prefix = OdataConstants.OdataRoute;
    public EdmApplicationModelProvider(IOptions<ODataOptions> options, IEdmModelManager modelManager)
    {
        options.Value.AddRouteComponents(prefix, EdmCoreModel.Instance);
        _modelManager = modelManager;
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
            if (controllerModel.ControllerName == "List")
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
    public class EntitySetTemplateSegment : ODataSegmentTemplate
    {
        public override IEnumerable<string> GetTemplates(ODataRouteOptions options)
        {
            yield return "/{entityset}";
            yield return "/{entityset}/{*any}";
        }

        public override bool TryTranslate(ODataTemplateTranslateContext context)
        {
            if (!context.RouteValues.TryGetValue("entityset", out object? classname))
            {
                return false;
            }

            string? entitySetName = classname as string;

            // if you want to support case-insensitive
            var edmEntitySet = context.Model.EntityContainer.EntitySets()
                .FirstOrDefault(e => string.Equals(entitySetName, e.Name, StringComparison.OrdinalIgnoreCase));

            //var edmEntitySet = context.Model.EntityContainer.FindEntitySet(entitySetName);
            if (edmEntitySet != null)
            {
                EntitySetSegment segment = new EntitySetSegment(edmEntitySet);
                context.Segments.Add(segment);
                return true;
            }

            return false;
        }
    }
    public class EntitySetWithKeyTemplateSegment : ODataSegmentTemplate
    {
        public override IEnumerable<string> GetTemplates(ODataRouteOptions options)
        {
            yield return "/{entityset}({key})";
            yield return "/{entityset}({key})/{*any}";
        }

        public override bool TryTranslate(ODataTemplateTranslateContext context)
        {
            if (!context.RouteValues.TryGetValue("entityset", out object? entitysetNameObj))
            {
                return false;
            }

            if (!context.RouteValues.TryGetValue("key", out object? keyObj))
            {
                return false;
            }

            string? entitySetName = entitysetNameObj as string;
            string? keyValue = keyObj as string;

            // if you want to support case-insensitive
            var edmEntitySet = context.Model.EntityContainer.EntitySets()
                .FirstOrDefault(e => string.Equals(entitySetName, e.Name, StringComparison.OrdinalIgnoreCase));

            //var edmEntitySet = context.Model.EntityContainer.FindEntitySet(entitySetName);
            if (edmEntitySet != null)
            {
                EntitySetSegment entitySet = new EntitySetSegment(edmEntitySet);
                IEdmEntityType? entityType = entitySet?.EntitySet?.EntityType;

                IEdmProperty keyProperty = entityType.Key().First();

                object newValue = ODataUriUtils.ConvertFromUriLiteral(keyValue, ODataVersion.V4, context.Model, keyProperty.Type);

                // for non FromODataUri, so update it, for example, remove the single quote for string value.
                context.UpdatedValues["key"] = newValue;

                // For FromODataUri, let's refactor it later.
                string prefixName = ODataParameterValue.ParameterValuePrefix + "key";
                context.UpdatedValues[prefixName] = new ODataParameterValue(newValue, keyProperty.Type);

                IDictionary<string, object> keysValues = new Dictionary<string, object>();
                keysValues[keyProperty.Name] = newValue;

                KeySegment keySegment = new KeySegment(keysValues, entityType, entitySet?.EntitySet);

                context.Segments.Add(keySegment);

                return true;
            }

            return false;
        }
    }
}
