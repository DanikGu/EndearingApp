using EndearingApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EndearingApp.Web.Config;

public static class DbConfig
{
    public static void AddDbElephant(this IServiceCollection services, IConfiguration configuration)
    {
        string? connectionString = configuration.GetConnectionString("DefaultConnection");
        string? postgresdb = configuration.GetConnectionString("postgresdb");
        var usedConnection = postgresdb ?? connectionString;
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                usedConnection,
                options => options.MigrationsHistoryTable("__efmigrationshistory", "customization")
            )
        );
    }
}
