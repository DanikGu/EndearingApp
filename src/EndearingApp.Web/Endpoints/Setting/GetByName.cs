using FastEndpoints;
using Mapster;
using EndearingApp.Core.SystemSettings;
using EndearingApp.Core.SystemSettings.Specifications;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Models;

namespace EndearingApp.Web.Endpoints.Setting;

public class GetByName : Endpoint<EmptyRequest, SettingDTO>
{
    private readonly IRepository<SystemSetting> _repository;

    public GetByName(IRepository<SystemSetting> repository)
    {
        _repository = repository;
    }

    public override void Configure()
    {
        Get("Setting/{Name}");
        AllowAnonymous();
    }

    public override async Task HandleAsync(
        EmptyRequest request,
        CancellationToken cancellationToken
    )
    {
        string name = Route<string>("Name")!;
        var settings = await _repository.ListAsync(new GetByNameSpec(name));
        var result = settings.FirstOrDefault();
        var response = result.Adapt<SettingDTO>();
        await SendAsync(response, cancellation: cancellationToken);
    }
}
