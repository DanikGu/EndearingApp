using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EndearingApp.SharedKernel.Interfaces;

namespace EndearingApp.Core.SystemSettings;
public class SystemSetting: IAggregateRoot
{
  public required Guid Id { get; set; }
  public string? Name { get; set; }
  public string? Description { get; set; }
  public string? JsonSetting { get; set; }
}
