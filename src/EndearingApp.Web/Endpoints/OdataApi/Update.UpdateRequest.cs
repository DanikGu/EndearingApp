namespace EndearingApp.Web.Endpoints.OdataApi;

public class UpdateRequest : Dictionary<string, object>
{
    public string? Id { get; set; }
    public string? TableName { get; set; }
}
