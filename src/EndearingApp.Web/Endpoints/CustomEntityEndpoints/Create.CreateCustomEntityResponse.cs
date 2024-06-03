namespace EndearingApp.Web.Endpoints.CustomEntityEndpoints;

public class CreateCustomEntityResponse
{
    public CreateCustomEntityResponse(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}
