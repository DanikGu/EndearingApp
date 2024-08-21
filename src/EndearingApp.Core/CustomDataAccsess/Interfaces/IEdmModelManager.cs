using Microsoft.OData.Edm;

namespace EndearingApp.Core.CustomDataAccsess.Interfaces;

public interface IEdmModelManager
{
    
    public IEdmModel Build();
    public IEdmModel GetModel();
    public string GetXmlModel();
}
