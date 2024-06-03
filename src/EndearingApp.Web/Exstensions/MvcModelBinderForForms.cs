using FastEndpoints;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;
using EndearingApp.Web.Endpoints.CustomEntityEndpoints;
using System.Globalization;
using Microsoft.AspNetCore.Mvc.Abstractions;

namespace EndearingApp.Web.Exstensions;

//porpouse of this class to correctly bind forms with array of object since it's not working in fast endpoints
public class MvcModelBinderForForms<T> : IRequestBinder<T> where T : class, new()
{
    public async ValueTask<T> BindAsync(BinderContext ctx, CancellationToken ct)
    {
        IFormCollection formCollection = ctx.HttpContext.Request.Form;

        var modelType = typeof(T);
        IModelBinderFactory _modelBinderFactory = ctx.Resolve<IModelBinderFactory>();

        var modelMetadataProvider = ctx.Resolve<IModelMetadataProvider>();
        var modelMetadata = modelMetadataProvider.GetMetadataForType(modelType);
        var actionDescriptor = new ActionDescriptor();
        var bindingInfo = new BindingInfo()
        {
            BinderModelName = "",
            BindingSource = Microsoft.AspNetCore.Mvc.ModelBinding.BindingSource.Form
        };
        var bindingContext = DefaultModelBindingContext.CreateBindingContext(
            new ActionContext(ctx.HttpContext, new RouteData(), actionDescriptor),
            new FormValueProvider(
                Microsoft.AspNetCore.Mvc.ModelBinding.BindingSource.Form,
                formCollection,
                default(CultureInfo)
            ),
            modelMetadata,
            bindingInfo,
            ""
        );
        var modelBinder = _modelBinderFactory.CreateBinder(
            new ModelBinderFactoryContext { Metadata = modelMetadata, BindingInfo = bindingInfo }
        );
        bindingInfo.BinderType = modelBinder.GetType();
        await modelBinder.BindModelAsync(bindingContext);
        var result = bindingContext.Result.Model as T;
        return result ?? new T();
    }
}
