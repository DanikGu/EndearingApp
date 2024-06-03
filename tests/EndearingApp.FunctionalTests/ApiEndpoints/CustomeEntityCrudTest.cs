/*using System.Text;
using System.Text.Json;
using Ardalis.HttpClientTestExtensions;
using EndearingApp.Web.Endpoints.CustomEntityEndpoints;
using Xunit;

namespace EndearingApp.FunctionalTests.ApiEndpoints;
public class CustomeEntityCrudTest : IClassFixture<CustomWebApplicationFactory<Program>>
{
  private readonly HttpClient _client;

  public CustomeEntityCrudTest(CustomWebApplicationFactory<Program> factory)
  {
    _client = factory.CreateClient();
  }

  [Fact]
  public async Task ReturnsSeedContributorGivenId1()
  {
    //setup
    var createCustomEntityRequest = new CreateCustomEntityRequest
    {
      Name = "ExampleEntity",
      Fields = new List<FieldDto>
            {
                new FieldDto
                {
                    Name = "id",
                    Type = "integer",
                    Size = null,
                    IsPrimaryKey = true
                },
                new FieldDto
                {
                    Name = "FieldName1",
                    Type = "varchar",
                    Size = 100,
                    IsPrimaryKey = false
                },
                new FieldDto
                {
                    Name = "FieldName2",
                    Type = "integer",
                    Size = null,
                    IsPrimaryKey = false
                }
            },
      Relationships = new List<RelationshipDto>()
    };
    var createCustomEntityRequest2 = new CreateCustomEntityRequest
    {
      Name = "ExampleEntitytwo",
      Fields = new List<FieldDto>
            {
                new FieldDto
                {
                    Name = "FieldName1",
                    Type = "varchar",
                    Size = 100,
                    IsPrimaryKey = false
                },
                new FieldDto
                {
                    Name = "id",
                    Type = "integer",
                    Size = null,
                    IsPrimaryKey = true
                }
            },
      Relationships = new List<RelationshipDto>() {
       //new RelationshipDto() {
       //  SourceFieldName = "ExampleEntityId",
       //  ReferencedTableName = "ExampleEntity",
       //  ReferencedFieldName = "id",
       //  ConstraintName = "fk_ExampleEntity",
       //}
      }
    };
    var updateCustomeEntityRequest = new UpdateCustomEntityRequest
    {
      Name = "ExampleEntity",
      Fields = new List<FieldUpdateDto>
            {
                new FieldUpdateDto
                {
                    Name = "id",
                    Type = "integer",
                    Size = null,
                    IsPrimaryKey = true
                },
                new FieldUpdateDto
                {
                    Name = "FieldName2",
                    Type = "integer",
                    Size = null,
                    IsPrimaryKey = false
                },
                new FieldUpdateDto
                {
                    Name = "FieldName3",
                    Type = "integer",
                    Size = null,
                    IsPrimaryKey = false
                }
            },
      Relationships = new List<RelationshipUpdateDto>()
    };
    var json = JsonSerializer.Serialize(createCustomEntityRequest, new JsonSerializerOptions { WriteIndented = true });
    var content = new StringContent(json, Encoding.UTF8, "application/json");
    var json2 = JsonSerializer.Serialize(updateCustomeEntityRequest, new JsonSerializerOptions { WriteIndented = true });
    var content2 = new StringContent(json2, Encoding.UTF8, "application/json");

    var json3 = JsonSerializer.Serialize(createCustomEntityRequest2, new JsonSerializerOptions { WriteIndented = true });
    var content3 = new StringContent(json3, Encoding.UTF8, "application/json");
    //act
    var result = await _client.PostAndDeserializeAsync<CreateCustomEntityResponse>(CreateCustomEntityRequest.Route, content);
    var result3 = await _client.PostAndDeserializeAsync<CreateCustomEntityResponse>(CreateCustomEntityRequest.Route, content3);

    var result2 = await _client.PostAndDeserializeAsync<UpdateCustomEntityResponse>(UpdateCustomEntityRequest.Route, content2);


    //assert
    Assert.NotEqual(Guid.Empty, result.Id);
  }
}

*/
