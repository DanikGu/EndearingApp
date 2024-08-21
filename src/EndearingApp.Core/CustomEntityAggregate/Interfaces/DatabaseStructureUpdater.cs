using EndearingApp.Core.CustomEntityAggregate.DbStructureModels;

namespace EndearingApp.Core.CustomEntityAggregate.Interfaces;
public interface IDatabaseStructureUpdater
{
  public Task UpdateDbStructure(DbStructure dbStructure);

}
