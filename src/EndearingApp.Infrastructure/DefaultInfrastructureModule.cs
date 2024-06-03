using System.Data;
using System.Reflection;
using Autofac;
using Autofac.Core;
using MediatR;
using MediatR.Pipeline;
using Microsoft.Data.SqlClient;
using Npgsql;
using EndearingApp.Core;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Infrastructure.Data;
using EndearingApp.Infrastructure.Data.CustomDataAccess;
using EndearingApp.SharedKernel;
using EndearingApp.SharedKernel.Interfaces;
using SqlForSchemaGenerator.Core.Interfaces;
using SqlForSchemaGenrator.Postgres;
using Module = Autofac.Module;

namespace EndearingApp.Infrastructure;

public class DefaultInfrastructureModule : Module
{
    private readonly bool _isDevelopment = false;
    private readonly List<Assembly> _assemblies = new List<Assembly>();

    public DefaultInfrastructureModule(bool isDevelopment, Assembly? callingAssembly = null)
    {
        _isDevelopment = isDevelopment;
        var coreAssembly = Assembly.GetAssembly(typeof(DefaultCoreModule));
        var infrastructureAssembly = Assembly.GetAssembly(typeof(AppDbContext));
        if (coreAssembly != null)
        {
            _assemblies.Add(coreAssembly);
        }

        if (infrastructureAssembly != null)
        {
            _assemblies.Add(infrastructureAssembly);
        }

        if (callingAssembly != null)
        {
            _assemblies.Add(callingAssembly);
        }
    }

    protected override void Load(ContainerBuilder builder)
    {
        if (_isDevelopment)
        {
            RegisterDevelopmentOnlyDependencies(builder);
        }
        else
        {
            RegisterProductionOnlyDependencies(builder);
        }

        RegisterCommonDependencies(builder);
    }

    private void RegisterCommonDependencies(ContainerBuilder builder)
    {
        builder
            .RegisterGeneric(typeof(EfRepository<>))
            .As(typeof(IRepository<>))
            .As(typeof(IReadRepository<>))
            .InstancePerLifetimeScope();

        builder.RegisterType<Mediator>().As<IMediator>().InstancePerLifetimeScope();

        builder
            .RegisterType<DomainEventDispatcher>()
            .As<IDomainEventDispatcher>()
            .InstancePerLifetimeScope();
        builder.RegisterType<PostgresSqlGenerator>().As<ISqlGenerator>().InstancePerLifetimeScope();

        builder
            .RegisterType<PostgresSqlTypeConvertor>()
            .As<ISqlTypesConverter>()
            .InstancePerLifetimeScope();
        builder
            .RegisterType<PostgresDbStructureBuilderWrapper>()
            .As<IDbStructureBuilder>()
            .InstancePerLifetimeScope();
        builder
            .RegisterType<PostgresDbStructureBuilderWrapper>()
            .As<IDbStructureCache>()
            .InstancePerLifetimeScope();

        builder.RegisterType<DapperSqlExecutor>().As<ISqlExecutor>().InstancePerLifetimeScope();

        builder
            .RegisterType<DefaultEdmModelMnager>()
            .As<IEdmModelManager>()
            .InstancePerLifetimeScope();

        builder
            .RegisterType<PostgresCustomDataAccessGenerator>()
            .As<ICustomDataAccessSqlGenerator>()
            .InstancePerLifetimeScope();
        //builder.Register<ServiceFactory>(context =>
        //{
        //  var c = context.Resolve<IComponentContext>();

        //  return t => c.Resolve(t);
        //});

        var mediatrOpenTypes = new[]
        {
            typeof(IRequestHandler<,>),
            typeof(IRequestExceptionHandler<,,>),
            typeof(IRequestExceptionAction<,>),
            typeof(INotificationHandler<>),
        };

        foreach (var mediatrOpenType in mediatrOpenTypes)
        {
            builder
                .RegisterAssemblyTypes(_assemblies.ToArray())
                .AsClosedTypesOf(mediatrOpenType)
                .AsImplementedInterfaces();
        }
    }

    private void RegisterDevelopmentOnlyDependencies(ContainerBuilder builder)
    {
        // NOTE: Add any development only services here
    }

    private void RegisterProductionOnlyDependencies(ContainerBuilder builder)
    {
        // NOTE: Add any production only services here
    }
}
