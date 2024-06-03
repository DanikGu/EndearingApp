using MediatR;
using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomEntityAggregate.Events;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.SharedKernel.Interfaces;
using SqlForSchemaGenerator.Core;
using SqlForSchemaGenerator.Core.Interfaces;
using SqlForSchemaGenerator.Core.Models;

namespace EndearingApp.Core.CustomEntityAggregate.Handlers;

public class CustomeDbStructureChangedHandler : INotificationHandler<CustomDbStructureChangedEvent>
{
    private readonly IDbStructureBuilder _dbStructureBuilder;
    private readonly ISqlGenerator _sqlGenerator;
    private readonly IRepository<CustomEntity> _customeEntityRepository;
    private readonly ISqlExecutor _sqlExecutor;
    private readonly ISqlTypesConverter _sqlTypesConverter;
    private readonly IEdmModelManager _edmModelManager;

    public CustomeDbStructureChangedHandler(
        IDbStructureBuilder dbStructureBuilder,
        ISqlGenerator sqlGenerator,
        IRepository<CustomEntity> customEntityRepository,
        ISqlExecutor sqlExecutor,
        ISqlTypesConverter sqlTypesConverter,
        IEdmModelManager edmModelManager
    )
    {
        _dbStructureBuilder = dbStructureBuilder;
        _sqlGenerator = sqlGenerator;
        _customeEntityRepository = customEntityRepository;
        _sqlExecutor = sqlExecutor;
        _sqlTypesConverter = sqlTypesConverter;
        _edmModelManager = edmModelManager;
    }

    public async Task Handle(
        CustomDbStructureChangedEvent notification,
        CancellationToken cancellationToken
    )
    {
        var customeEntities = await _customeEntityRepository.ListAsync(new GetAllSpec());
        var targetStructure = MapCustomEntitiesToDbStructure(customeEntities);
        var currentStructure = _dbStructureBuilder.Build();
        var diffChecker = new DiffChecker(currentStructure, targetStructure, _sqlTypesConverter);
        var sql = _sqlGenerator.GetSql(diffChecker);
        if (string.IsNullOrEmpty(sql))
        {
            return;
        }
        var result = await _sqlExecutor.Execute(sql);
        _edmModelManager.Build();
    }

    private DbStructure MapCustomEntitiesToDbStructure(
        List<CustomEntity> customEntities,
        bool mapToDbTypes = true
    )
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
                            new SqlForSchemaGenerator.Core.Models.Field
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

            var relationships = new List<SqlForSchemaGenerator.Core.Models.Relationship>();
            foreach (var rel in customEntity.Relationships)
            {
                var relationship = new SqlForSchemaGenerator.Core.Models.Relationship
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
