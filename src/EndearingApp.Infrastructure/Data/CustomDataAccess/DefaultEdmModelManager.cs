using System.Text;
using System.Xml;
using Microsoft.OData.Edm;
using Microsoft.OData.Edm.Csdl;
using Microsoft.OData.Edm.Validation;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomEntityAggregate;
using EndearingApp.SharedKernel.Interfaces;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.Core.CustomEntityAggregate.DbStructureModels;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;

public class DefaultEdmModelManager : IEdmModelManager
{
    public DefaultEdmModelManager(IRepository<CustomEntity> _customEntityRepository)
    {
        this._customEntityRepository = _customEntityRepository;
    }

    private static IEdmModel? _edmModel;
    private readonly IRepository<CustomEntity> _customEntityRepository;

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
        var customeEntities = _customEntityRepository.ListAsync(new GetAllSpec()).
            GetAwaiter().GetResult();
        var structure = MapCustomEntitiesToDbStructure(customeEntities);
        var builder = new EdmModelBuilderDbStructure(structure!);
        _edmModel = builder.Model;
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
    private DbStructure MapCustomEntitiesToDbStructure(
       List<CustomEntity> customEntities,
       bool mapToDbTypes = true)
    {
        var dbStructure = new DbStructure();
        var tables = new List<Table>();
        foreach (var customEntity in customEntities)
        {
            var table = new Table
            {
                Name = customEntity.Name,
                Fields = customEntity.Fields
                    .Select(
                        f =>
                            new EndearingApp.Core.CustomEntityAggregate.DbStructureModels.Field
                            {
                                Name = f.Name,
                                Type = f.Type,
                                Size = f.Size,
                                IsPrimaryKey = f.IsPrimaryKey
                            }
                    )
                    .ToArray()
            };

            tables.Add(table);
        }
        foreach (var table in tables)
        {
            var customEntity = customEntities.First(ce => ce.Name == table.Name);

            var relationships = new List<EndearingApp.Core.CustomEntityAggregate.DbStructureModels.Relationship>();
            foreach (var rel in customEntity.Relationships)
            {
                var relationship = new EndearingApp.Core.CustomEntityAggregate.DbStructureModels.Relationship
                {
                    ConstraintName = rel.ConstraintName!,
                    Table = table,
                    Field = table.Fields.First(f => f.Name == rel.SourceFieldName),
                    ReferencedTable = tables.First(t => t.Name == rel.ReferencedTableName),
                    ReferencedField = tables
                        .First(t => t.Name == rel.ReferencedTableName)
                        .Fields.First(f => f.Name == rel.ReferencedFieldName)
                };
                relationships.Add(relationship);
            }
            table.Relationships = relationships.ToArray();
        }
        dbStructure.Tables = tables.ToArray();
        return dbStructure;
    }
}
