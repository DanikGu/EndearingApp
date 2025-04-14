using System.Diagnostics;
using Ardalis.ListStartupServices;
using Ardalis.Result.AspNetCore;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using EndearingApp.Core;
using EndearingApp.Core.CustomEntityAggregate.Events;
using EndearingApp.Infrastructure;
using EndearingApp.Infrastructure.Data;
using EndearingApp.Web.Config;
using EndearingApp.Web.DynamicOdataApiServices;
using MediatR;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.Batch;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.OData.Edm;
using OpenTelemetry;
using OpenTelemetry.Exporter;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Sinks.OpenTelemetry;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

builder.Host
    .UseSerilog((_, config) => config.ReadFrom.Configuration(builder.Configuration));
Log.Logger = new LoggerConfiguration()
    .WriteTo.OpenTelemetry(
        endpoint: "http://127.0.0.1:14268")
    .CreateLogger();
builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});

string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        connectionString,
        options => options.MigrationsHistoryTable("__efmigrationshistory", "customization")
    )
);
builder.Services.AddMapster();

builder.Services.Configure<ServiceConfig>(config =>
{
    config.Services = new List<ServiceDescriptor>(builder.Services);
    config.Path = "/listservices";
});

builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
{
    containerBuilder.RegisterModule(new DefaultCoreModule());
    containerBuilder.RegisterModule(
        new DefaultInfrastructureModule(builder.Environment.EnvironmentName == "Development")
    );
});

builder.Services.AddControllers(mvcOptions => mvcOptions.AddDefaultResultConvention())
    .AddOData(opt => opt.EnableQueryFeatures(null)
    .AddRouteComponents(
            OdataConstants.OdataRoute,
            EdmCoreModel.Instance,
            configureServices: services =>
            {
                services.AddSingleton((IServiceProvider sp) => new DefaultODataBatchHandler());

            }
        ));

builder.Services.TryAddEnumerable(
    ServiceDescriptor.Transient<IApplicationModelProvider, EdmApplicationModelProvider>()
);
builder.Services.TryAddEnumerable(
    ServiceDescriptor.Singleton<MatcherPolicy, CustomEdmModelMatcherPolicy>()
);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
var otel = builder.Services.AddOpenTelemetry();
var tracingOtlpEndpoint = builder.Configuration["OTLP_ENDPOINT_URL"];
otel.WithTracing(tracing =>
{
    tracing.AddAspNetCoreInstrumentation();
    tracing.AddHttpClientInstrumentation();
    tracing.AddSource(Program.EndearingAppActivitySource.Name);
    if (tracingOtlpEndpoint != null)
    {
        tracing.AddOtlpExporter(otlpOptions =>
        {
            otlpOptions.Endpoint = new Uri(tracingOtlpEndpoint!);
        });
    }
    else
    {
        tracing.AddConsoleExporter();
    }
});
//builder.Services.AddOpenTelemetry()
//    
//    .UseOtlpExporter(OtlpExportProtocol.HttpProtobuf, new Uri("http://localhost:4317"))
//    .WithTracing(tracing => 
//        tracing.AddSource("Endearing App")
//    );
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseShowAllServicesMiddleware();
}
else
{
    //TODO: check ????
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
app.UseODataBatching();
app.UseRouting();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
;

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCookiePolicy();
app.UseODataRouteDebug();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
        var mediator = services.GetRequiredService<IMediator>();
        mediator.Publish(new CustomDbStructureChangedEvent()).GetAwaiter().GetResult();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred seeding the DB. {exceptionMessage}", ex.Message);
    }
}

app.Run();

// Make the implicit Program.cs class public, so integration tests can reference the correct assembly for host building
public partial class Program {
    public static ActivitySource EndearingAppActivitySource = new ActivitySource("EndearingApp");
}
