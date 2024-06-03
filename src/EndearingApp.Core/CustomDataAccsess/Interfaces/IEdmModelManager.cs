using Microsoft.OData.Edm;
using SqlForSchemaGenerator.Core.Models;

namespace EndearingApp.Core.CustomDataAccsess.Interfaces;

public interface IEdmModelManager
{
    public IEdmModel Build();
    public IEdmModel GetModel();
    public string GetXmlModel();
}
