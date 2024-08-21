namespace EndearingApp.Core.CustomEntityAggregate.DbStructureModels;

public enum RelationshipDeleteBehavior
{
    Restrict,
    SetNull,
    Cascade,
    NoAction
}
