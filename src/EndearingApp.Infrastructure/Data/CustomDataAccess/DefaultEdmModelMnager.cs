using System.Text;
using System.Xml;
using EdmModelBuilder;
using Microsoft.OData.Edm;
using Microsoft.OData.Edm.Csdl;
using Microsoft.OData.Edm.Validation;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using SqlForSchemaGenerator.Core.Interfaces;
using SqlForSchemaGenerator.Core.Models;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;

public class DefaultEdmModelMnager : IEdmModelManager
{
    public DefaultEdmModelMnager(IDbStructureBuilder dbStructureBuilder)
    {
        _dbStructureBuilder = dbStructureBuilder;
    }

    private static IEdmModel? _edmModel;
    private readonly IDbStructureBuilder _dbStructureBuilder;

    public IEdmModel Build()
    {
        BuildCurrent();
        return _edmModel!;
    }

    public IEdmModel GetModel()
    {
        if (_edmModel is null)
        {
            BuildCurrent();
        }
        return _edmModel!;
    }

    public string GetXmlModel()
    {
        if (_edmModel is null)
        {
            BuildCurrent();
        }
        return WriteModelToCsdl(_edmModel!);
    }

    private void BuildCurrent()
    {
        var dbStructure = _dbStructureBuilder.Build();
        var edmModelBuilder = new EdmModelBuilderDbStructure(dbStructure);
        var model = edmModelBuilder.Model;
        _edmModel = model;
    }

    private static string WriteModelToCsdl(IEdmModel model)
    {
        var result = new StringBuilder();
        using (var writer = XmlWriter.Create(result))
        {
            IEnumerable<EdmError> errors;
            CsdlWriter.TryWriteCsdl(model, writer, CsdlTarget.OData, out errors);
            return result.ToString();
        }
    }
}
