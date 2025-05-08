using Autofac;
using EndearingApp.Core;
using EndearingApp.Infrastructure;

namespace EndearingApp.Web.Config;

public static class DiConfig
{
    public static void AddAutofuckContainers(this WebApplicationBuilder builder)
    {
        builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
        {
            containerBuilder.RegisterModule(new DefaultCoreModule());
            containerBuilder.RegisterModule(
                new DefaultInfrastructureModule(builder.Environment.EnvironmentName == "Development")
            );
        });
    }
}
