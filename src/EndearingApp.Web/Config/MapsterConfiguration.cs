using Mapster;
using EndearingApp.Web.Models;
using System.Reflection;

namespace EndearingApp.Web.Config;

public static class MapsterConfiguration
{
    public static void AddMapster(this IServiceCollection services)
    {
        var typeAdapterConfig = TypeAdapterConfig.GlobalSettings;
        Assembly applicationAssembly = typeof(BaseDto<,>).Assembly;
        typeAdapterConfig.Scan(applicationAssembly);
    }
}
