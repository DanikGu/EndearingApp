﻿using System.Reflection;
using Autofac;
using Mapster;
using MapsterMapper;
using EndearingApp.Core.CustomDataAccsess.Services;
using EndearingApp.SharedKernel.Interfaces;
using Module = Autofac.Module;

namespace EndearingApp.Core;

public class DefaultCoreModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        AddMapster(builder);
        builder
            .RegisterType<CustomDataCrudService>()
            .As<CustomDataCrudService>()
            .InstancePerLifetimeScope();
    }

    public void AddMapster(ContainerBuilder builder)
    {
        var typeAdapterConfig = TypeAdapterConfig.GlobalSettings;
        Assembly applicationAssembly = typeof(DefaultCoreModule).Assembly;
        typeAdapterConfig.Scan(applicationAssembly);
        builder
            .Register(ctx => new Mapper(typeAdapterConfig))
            .As<IMapper>()
            .InstancePerDependency();
    }
}
