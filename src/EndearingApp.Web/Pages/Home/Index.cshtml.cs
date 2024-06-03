using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Models;

namespace EndearingApp.Web.Pages.Home;

public class IndexModel : PageModel
{
    private readonly IRepository<CustomEntity> _repository;
    private readonly IMapper _mapper;
    public List<CustomeEntityDTO> CustomeEntities = new();

    public IndexModel(IRepository<CustomEntity> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task OnGetAsync()
    {
        var dbCustomEntities = await _repository.ListAsync(new GetAllSpec());
        CustomeEntities = _mapper.Map<List<CustomeEntityDTO>>(dbCustomEntities);
    }

    public async Task<IActionResult> OnGetAsyncCreateForm()
    {
        var dbCustomEntities = await _repository.ListAsync(new GetAllSpec());
        CustomeEntities = _mapper.Map<List<CustomeEntityDTO>>(dbCustomEntities);
        return Partial("~/Pages/Partial/DataEdit/CustomEntity/_Create.cshtml", CustomeEntities);
    }

    public async Task<IActionResult> OnGetAsyncUpdateForm(Guid id)
    {
        var dbCustomEntities = await _repository.ListAsync(new GetAllSpec());
        CustomeEntities = _mapper.Map<List<CustomeEntityDTO>>(dbCustomEntities);
        return Partial(
            "~/Pages/Partial/DataEdit/CustomEntity/_Update.cshtml",
            (CustomeEntities, CustomeEntities.First(x => x.Id == id))
        );
    }
}
