using Microsoft.AspNetCore.OData.Routing.Template;
using Microsoft.AspNetCore.OData.Routing;
using Microsoft.OData.UriParser;
using Microsoft.OData.Edm;

namespace EndearingApp.Web.DynamicOdataApiServices.TemplateSegments;

public class EntitySetFullTextSearchTemplate : ODataSegmentTemplate
{
    public override IEnumerable<string> GetTemplates(ODataRouteOptions options)
    {
        yield return "/{entityset}/FullTextSearch/{query}";
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
