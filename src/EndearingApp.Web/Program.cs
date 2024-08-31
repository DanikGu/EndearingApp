using Ardalis.ListStartupServices;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using EndearingApp.Core;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomEntityAggregate.Events;
using EndearingApp.Core.CustomEntityAggregate.Interfaces;
using EndearingApp.Infrastructure;
using EndearingApp.Infrastructure.Data;
using EndearingApp.Web.Config;
using EndearingApp.Web.DynamicOdataApiServices;
using FastEndpoints;
using FastEndpoints.ApiExplorer;
using FastEndpoints.Swagger.Swashbuckle;
using MediatR;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.Batch;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

builder.Host.UseSerilog((_, config) => config.ReadFrom.Configuration(builder.Configuration));

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});

string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(
    options =>
        options.UseNpgsql(
            connectionString,
            options => options.MigrationsHistoryTable("__efmigrationshistory", "customization")
        )
);
builder.Services.AddRazorPages();
builder.Services.AddFastEndpoints();
builder.Services.AddFastEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
    c.EnableAnnotations();
    c.OperationFilter<FastEndpointsOperationFilter>();
});
builder.Services.AddMapster();


builder.Services.Configure<ServiceConfig>(config =>
{
    config.Services = new List<ServiceDescriptor>(builder.Services);

    // optional - default path to view services is /listallservices - recommended to choose your own path
    config.Path = "/listservices";
});

builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
{
    containerBuilder.RegisterModule(new DefaultCoreModule());
    containerBuilder.RegisterModule(
        new DefaultInfrastructureModule(builder.Environment.EnvironmentName == "Development")
    );
});
builder.Services.AddControllers()
    .AddOData(opt => opt.Count().Filter().Expand().Select().OrderBy().SetMaxTop(null));
builder.Services.TryAddEnumerable(
                ServiceDescriptor.Transient<IApplicationModelProvider, EdmApplicationModelProvider>());
builder.Services.TryAddEnumerable(
    ServiceDescriptor.Singleton<MatcherPolicy, CustomEdmModelMatcherPolicy>());
//builder.Logging.AddAzureWebAppDiagnostics(); add this if deploying to Azure

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseShowAllServicesMiddleware();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseRouting();
app.UseFastEndpoints(c =>
{
    c.Serializer.RequestDeserializer = async (req, tDto, jCtx, ct) =>
    {
        using var reader = new StreamReader(req.Body);
        return Newtonsoft.Json.JsonConvert.DeserializeObject(await reader.ReadToEndAsync(), tDto);
    };
});

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCookiePolicy();
app.UseODataRouteDebug();
// Enable middleware to serve generated Swagger as a JSON endpoint.
app.UseSwagger();
// Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1"));

//app.MapDefaultControllerRoute();
app.MapRazorPages();
app.MapControllers();
// Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
        var mediator = services.GetRequiredService<IMediator>();
        mediator.Publish(new CustomDbStructureChangedEvent()).GetAwaiter().GetResult();




        //context.Database.EnsureCreated();
        //SeedData.Initialize(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred seeding the DB. {exceptionMessage}", ex.Message);
    }
}
    
app.Run();

// Make the implicit Program.cs class public, so integration tests can reference the correct assembly for host building
public partial class Program { }
