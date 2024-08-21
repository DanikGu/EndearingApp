using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EndearingApp.Core.CustomEntityAggregate.DbStructureModels;
using Microsoft.OData.Edm;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;
public class EdmModelBuilderDbStructure
{
    public EdmModelBuilderDbStructure(DbStructure dbStructure)
    {
        Model = BuildOdataSchema(dbStructure);
    }
    public IEdmModel Model { get; }

    private IEdmModel BuildOdataSchema(DbStructure dbStructure)
    {
        var model = new EdmModel();
        var container = new EdmEntityContainer("DefaultNamespace", "DefaultContainer");
        model.AddElement(container);

        var entityTypes = new Dictionary<string, EdmEntityType>();

        foreach (var table in dbStructure.Tables!)
        {
            var entityType = new EdmEntityType("DefaultNamespace", table.Name);
            model.AddElement(entityType);
            entityTypes[table!.Name!] = entityType;

            foreach (var field in table.Fields)
            {
                var edmType = EdmCoreModel.Instance.GetPrimitive(MapSystemTypesToEdmPrimitive(field!.Type!), true);
                var property = new EdmStructuralProperty(entityType, field.Name, edmType);
                entityType.AddProperty(property);
                if (field.IsPrimaryKey)
                {
                    entityType.AddKeys(property);
                }
            }

            var entitySet = new EdmEntitySet(container, table.Name, entityType);
            container.AddElement(entitySet);
        }

        foreach (var relationship in dbStructure!.GetAllRelationships()!)
        {
            var dependentEntityType = entityTypes[relationship!.Table!.Name!];
            var principalEntityType = entityTypes[relationship!.ReferencedTable!.Name!];

            var navigationProperty = dependentEntityType.AddUnidirectionalNavigation(
                new EdmNavigationPropertyInfo
                {
                    Name = relationship.ConstraintName,
                    Target = principalEntityType,
                    TargetMultiplicity = EdmMultiplicity.ZeroOrOne
                });

            var dependentEntitySet = container.FindEntitySet(relationship.Table.Name);
            var principalEntitySet = container.FindEntitySet(relationship.ReferencedTable.Name);
            (dependentEntitySet as EdmEntitySet)!.AddNavigationTarget(navigationProperty, principalEntitySet);
        }

        return model;
    }

    private EdmPrimitiveTypeKind MapSystemTypesToEdmPrimitive(SystemTypesEnum systemType)
    {
        switch (systemType)
        {
            case SystemTypesEnum.SmallInteger:
                return EdmPrimitiveTypeKind.Int16;
            case SystemTypesEnum.Integer:
                return EdmPrimitiveTypeKind.Int32;
            case SystemTypesEnum.BigInteger:
                return EdmPrimitiveTypeKind.Int64;
            case SystemTypesEnum.Decimal:
                return EdmPrimitiveTypeKind.Decimal;
            case SystemTypesEnum.Real:
                return EdmPrimitiveTypeKind.Single;
            case SystemTypesEnum.Double:
                return EdmPrimitiveTypeKind.Double;
            case SystemTypesEnum.UnlimitedText:
            case SystemTypesEnum.LimitedText:
                return EdmPrimitiveTypeKind.String;
            case SystemTypesEnum.Date:
                return EdmPrimitiveTypeKind.Date;
            case SystemTypesEnum.Time:
                return EdmPrimitiveTypeKind.TimeOfDay;
            case SystemTypesEnum.Timestamp:
                return EdmPrimitiveTypeKind.DateTimeOffset;
            case SystemTypesEnum.Boolean:
                return EdmPrimitiveTypeKind.Boolean;
            case SystemTypesEnum.Binary:
                return EdmPrimitiveTypeKind.Binary;
            case SystemTypesEnum.UUID:
                return EdmPrimitiveTypeKind.Guid;
            default:
                return EdmPrimitiveTypeKind.None;
        }
    }
}
