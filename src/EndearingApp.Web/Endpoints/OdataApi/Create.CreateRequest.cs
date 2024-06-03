namespace EndearingApp.Web.Endpoints.OdataApi;

public class CreateRequest : Dictionary<string, object>
{
    public string? TableName { get; set; }
}
