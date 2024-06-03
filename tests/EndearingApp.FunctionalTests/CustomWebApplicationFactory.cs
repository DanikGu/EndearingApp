using System.Net;
using System.Net.NetworkInformation;
using System.Text;
using CliWrap;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Npgsql;
using EndearingApp.Infrastructure.Data;

namespace EndearingApp.FunctionalTests;

public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram>
    where TProgram : class
{
    private string? _testDatabaseContainerId = null;
    private bool _disposed = false;

    /// <summary>
    /// Overriding CreateHost to avoid creating a separate ServiceProvider per this thread:
    /// https://github.com/dotnet-architecture/eShopOnWeb/issues/465
    /// </summary>
    /// <param name="builder"></param>
    /// <returns></returns>
    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.UseEnvironment("Development"); // will not send real
        var host = builder.Build();
        host.Start();

        // Get service provider.
        var serviceProvider = host.Services;

        // Create a scope to obtain a reference to the database
        // context (AppDbContext).
        using (var scope = serviceProvider.CreateScope())
        {
            var scopedServices = scope.ServiceProvider;
            var db = scopedServices.GetRequiredService<AppDbContext>();

            var logger = scopedServices.GetRequiredService<
                ILogger<CustomWebApplicationFactory<TProgram>>
            >();

            db.Database.Migrate();

            try
            {
                // Can also skip creating the items
                //if (!db.ToDoItems.Any())
                //{
                // Seed the database with test data.

                //}
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "An error occurred seeding the "
                        + "database with test messages. Error: {exceptionMessage}",
                    ex.Message
                );
            }
        }

        return host;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>)
            );

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }
            var connectionString = CreateDockerDatabase();
            services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (_disposed)
        {
            return;
        }
        if (_testDatabaseContainerId != null)
        {
            Cli.Wrap("docker")
                .WithArguments("container stop " + _testDatabaseContainerId)
                .ExecuteAsync()
                .GetAwaiter()
                .GetResult();
            Cli.Wrap("docker")
                .WithArguments("container rm " + _testDatabaseContainerId)
                .ExecuteAsync()
                .GetAwaiter()
                .GetResult();
            _disposed = true;
        }
    }

    private string CreateDockerDatabase()
    {
        var testDbName = "TestDbName_" + Guid.NewGuid().ToString().Replace("-", "");
        var containerName = "TestContainer" + Guid.NewGuid().ToString().Replace("-", "");
        var port = GetEmptyPort();
        var outBuff = new StringBuilder();
        var errorBuff = new StringBuilder();
        Cli.Wrap("docker")
            .WithArguments(
                $"run --name {containerName} -e POSTGRES_PASSWORD=postgres -p {port}:5432 -d postgres"
            )
            .WithStandardOutputPipe(PipeTarget.ToStringBuilder(outBuff))
            .WithStandardErrorPipe(PipeTarget.ToStringBuilder(errorBuff))
            .ExecuteAsync()
            .GetAwaiter()
            .GetResult();
        _testDatabaseContainerId = outBuff.ToString().Replace("\n", "");
        CreateDatabase(testDbName, port);
        var connectionString =
            $"Host=localhost;Port={port};Database={testDbName};Username=postgres;Password=postgres";
        return connectionString;
    }

    private bool IsBusy(int port)
    {
        IPGlobalProperties ipGP = IPGlobalProperties.GetIPGlobalProperties();
        IPEndPoint[] endpoints = ipGP.GetActiveTcpListeners();
        if (endpoints == null || endpoints.Length == 0)
            return false;
        for (int i = 0; i < endpoints.Length; i++)
            if (endpoints[i].Port == port)
                return true;
        return false;
    }

    private int GetEmptyPort()
    {
        var currentPort = 5500;
        while (true)
        {
            if (!IsBusy(currentPort))
            {
                return currentPort;
            }
            currentPort++;
        }
    }

    private void CreateDatabase(string dbName, int port)
    {
        string connString =
            $"Host=localhost;Port={port};Username=postgres;Password=postgres;Database=postgres";
        using (var conn = new NpgsqlConnection(connString))
        {
            while (true)
            {
                try
                {
                    Thread.Sleep(300);
                    conn.Open();
                    break;
                }
                catch { }
            }
            var sql = $"CREATE DATABASE {dbName}";

            using (var command = new NpgsqlCommand(sql, conn))
            {
                command.ExecuteNonQuery();
            }
        }
    }
}
