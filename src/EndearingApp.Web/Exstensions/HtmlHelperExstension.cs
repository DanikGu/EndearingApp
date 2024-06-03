using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;

namespace EndearingApp.Web.Exstensions;

public static class HtmlHelperExstension
{
    public static HtmlString ToJson(this IHtmlHelper helper, object obj)
    {
        var settings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
        settings.Converters.Add(new JavaScriptDateTimeConverter());
        return (HtmlString)helper.Raw(JsonConvert.SerializeObject(obj, settings));
    }
}
