﻿using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.Core.SystemSettingsAggregate;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Web.Models;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using GetByNameSpec = EndearingApp.Core.SystemSettingsAggregate.Specifications.GetByNameSpec;

namespace EndearingApp.Web.Controllers;
[Route("api/[controller]")]
[ApiController]
public class SettingsController : Controller
{
    private readonly IRepository<SystemSetting> _repository;

    public SettingsController(IRepository<SystemSetting> repository)
    {
        _repository = repository;
    } 

    [HttpGet("{name}")]
    public async Task <ActionResult<SettingDTO>>Index(string name, CancellationToken cancellationToken)
    {
        var result = await _repository.FirstOrDefaultAsync(new GetByNameSpec(name), cancellationToken);
        var response = result.Adapt<SettingDTO>();
        return Ok(response);
    }
}
