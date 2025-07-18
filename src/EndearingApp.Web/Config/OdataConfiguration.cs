using Ardalis.Result.AspNetCore;
using EndearingApp.Web.DynamicOdataApiServices;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.Batch;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.OData.Edm;
using Newtonsoft.Json;

namespace EndearingApp.Web.Config;

public static class OdataConfiguration
{
    public static void AddOdataBeast(this WebApplicationBuilder builder)
    {
        builder.Services.AddControllers(mvcOptions => mvcOptions.AddDefaultResultConvention())
            .AddOData(opt =>
                {
                    opt.EnableQueryFeatures(null)
                        .AddRouteComponents(
                            OdataConstants.OdataRoute,
                            EdmCoreModel.Instance,
                            configureServices: services =>
                            {
                                services.AddSingleton((IServiceProvider sp) => new DefaultODataBatchHandler());
                            }
                        );
                    opt.TimeZone = TimeZoneInfo.Utc;
                }
            );

        builder.Services.TryAddEnumerable(
            ServiceDescriptor.Transient<IApplicationModelProvider, EdmApplicationModelProvider>()
        );
        builder.Services.TryAddEnumerable(
            ServiceDescriptor.Singleton<MatcherPolicy, CustomEdmModelMatcherPolicy>()
        );
    }
}
