using System.Runtime.Serialization;

namespace EndearingApp.Web.Endpoints.CustomEntityEndpoints;

public class DeleteCustomEntityRequest
{
  public const string Route = "/CustomEntity/{Name}";
  public required string Name { get; set; }

}
