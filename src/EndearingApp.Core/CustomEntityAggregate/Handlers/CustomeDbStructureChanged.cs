using EndearingApp.Core.CustomDataAccsess.Interfaces;
using EndearingApp.Core.CustomEntityAggregate.DbStructureModels;
using EndearingApp.Core.CustomEntityAggregate.Events;
using EndearingApp.Core.CustomEntityAggregate.Interfaces;
using EndearingApp.Core.CustomEntityAggregate.Specifications;
using EndearingApp.SharedKernel.Interfaces;
using MediatR;

namespace EndearingApp.Core.CustomEntityAggregate.Handlers;

public class CustomeDbStructureChangedHandler : INotificationHandler<CustomDbStructureChangedEvent>
{
    private readonly IRepository<CustomEntity> _customEntityRepository;
    private readonly IDatabaseStructureUpdater _databaseStructureUpdater;
    private readonly IEdmModelManager _edmModelManager;

    public CustomeDbStructureChangedHandler(
        IRepository<CustomEntity> customEntityRepository,
        IDatabaseStructureUpdater databaseStructureUpdater,
        IEdmModelManager edmModelManager
    )
    {
        _customEntityRepository = customEntityRepository;
        _databaseStructureUpdater = databaseStructureUpdater;
        _edmModelManager = edmModelManager;
    }

    public async Task Handle(
        CustomDbStructureChangedEvent notification,
        CancellationToken cancellationToken
    )
    {
        var customeEntities = await _customEntityRepository.ListAsync(new GetAllSpec());
        var targetStructure = MapCustomEntitiesToDbStructure(customeEntities);
        await _databaseStructureUpdater.UpdateDbStructure(targetStructure);
        _edmModelManager.Build();
    }

    private bool IsOptionSet(Field field)
    {
        return field.Type == SystemTypesEnum.OptionSet
            || field.Type == SystemTypesEnum.OptionSetMutiSelect;
    }

    private DbStructure MapCustomEntitiesToDbStructure(List<CustomEntity> customEntities)
    {
        var dbStructure = new DbStructure();
        var tables = new List<Table>();
        var optSets = customEntities
            .SelectMany(x => x.Fields)
            .Select(x => x.OptionSetDefinition)
            .Where(x => x != null)
            .ToList();
        var optDefToOptModel = new Dictionary<Guid, OptionSet>();
        dbStructure.OptionSets = optSets
            .Select(x =>
            {
                var optSet = new OptionSet
                {
                    Name = x!.Name,
                    Options = x
                        .Options.Select(y => new DbStructureModels.Option
                        {
                            Name = y.Name,
                            Value = y.Value,
                        })
                        .ToList(),
                };
                optDefToOptModel[x.Id] = optSet;
                return optSet;
            })
            .ToArray();
        foreach (var customEntity in customEntities)
        {
            var table = new Table
            {
                Name = customEntity.Name,
                Fields = customEntity
                    .Fields.Select(f => new DbStructureModels.Field
                    {
                        Name = f.Name,
                        Type = f.Type,
                        Size = f.Size,
                        IsPrimaryKey = f.IsPrimaryKey,
                        IsIndexed = f.IsIndexed,
                        IsNullable = f.IsNullable,
                        IsUnique = f.IsUnique,
                        IsRequired = f.IsRequired,
                        IsSystemField = f.IsSystemField,
                        OptionSet = IsOptionSet(f)
                            ? optDefToOptModel[f.OptionSetDefinition!.Id]
                            : null,
                    })
                    .ToArray(),
            };

            tables.Add(table);
        }
        foreach (var table in tables)
        {
            var customEntity = customEntities.First(ce => ce.Name == table.Name);

            var relationships = new List<DbStructureModels.Relationship>();
            foreach (var rel in customEntity.Relationships)
            {
                var relationship = new DbStructureModels.Relationship
                {
                    ConstraintName = rel.ConstraintName!,
                    Table = table,
                    Field = table.Fields.First(f => f.Name == rel.SourceFieldName),
                    ReferencedTable = tables.First(t => t.Name == rel.ReferencedTableName),
                    ReferencedField = tables
                        .First(t => t.Name == rel.ReferencedTableName)
                        .Fields.First(f => f.Name == rel.ReferencedFieldName),
                };
                relationships.Add(relationship);
            }
            table.Relationships = relationships.ToArray();
        }
        dbStructure.Tables = tables.ToArray();
        return dbStructure;
    }
}
