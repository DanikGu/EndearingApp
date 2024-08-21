using System.Linq;
using Ardalis.ListStartupServices;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using FastEndpoints;
using FastEndpoints.ApiExplorer;
using FastEndpoints.Swagger.Swashbuckle;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.FileProviders.Physical;
using Microsoft.OpenApi.Models;
using Serilog;
using EndearingApp.Core;
using EndearingApp.Infrastructure;
using EndearingApp.Infrastructure.Data;
using EndearingApp.Web;
using EndearingApp.Web.Config;
using EndearingApp.Web.Endpoints.CustomEntityEndpoints;
using EndearingApp.Web.Exstensions;
using Microsoft.AspNetCore.OData;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomEntityAggregate.Interfaces;
using EndearingApp.Core.CustomEntityAggregate.Events;
using MediatR;

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

// Enable middleware to serve generated Swagger as a JSON endpoint.
app.UseSwagger();

// Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1"));

app.MapDefaultControllerRoute();
app.MapRazorPages();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
        var midiator = services.GetRequiredService<IMediator>();
        midiator.Publish(new CustomDbStructureChangedEvent()).GetAwaiter().GetResult();

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
