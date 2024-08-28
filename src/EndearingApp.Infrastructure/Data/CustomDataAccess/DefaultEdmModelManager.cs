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
using Microsoft.OData.ModelBuilder;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;
using System.Reflection;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;

public class DefaultEdmModelManager : IEdmModelManager
{
    public DefaultEdmModelManager(ICustomEntityDataProvider entityQueryDataProvider)
    {
        _entityQueryDataProvider = entityQueryDataProvider;
    }

    private static IEdmModel? _edmModel;
    private readonly ICustomEntityDataProvider _entityQueryDataProvider;

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
        var modelBuilder = new ODataConventionModelBuilder();
        var types = GetDbContextTypes();
        if (types is null) 
        {
            throw new ArgumentNullException(nameof(types));
        }
        foreach (var type in types) 
        {
            var name = GetTableName(type);
            MethodInfo method = typeof(ODataConventionModelBuilder).
                GetMethod(nameof(ODataConventionModelBuilder.EntitySet))!;
            MethodInfo generic = method.MakeGenericMethod(type);
            generic.Invoke(modelBuilder,new object[] { name });
        }
        _edmModel = modelBuilder.GetEdmModel();
    }
    private string GetTableName(Type tableType) 
    {
        return (tableType.GetCustomAttributes(typeof(TableAttribute), true).
            FirstOrDefault() as TableAttribute)?.Name ?? 
            throw new ArgumentException("Table type without name");
    }
    private Type[]? GetDbContextTypes()    
    {
        var types = new List<Type>();
        foreach (var prop in _entityQueryDataProvider?.GetDbContext()?.GetType()?.GetProperties()! ) 
        {
            if (prop.PropertyType.FullName?.Contains("DbSet") ?? false) 
            {
                var generic = prop.PropertyType.GetGenericArguments().First();
                types.Add(generic);
            }
        }
        return types.ToArray();
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
