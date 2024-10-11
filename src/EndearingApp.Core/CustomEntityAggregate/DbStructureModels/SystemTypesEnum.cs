using System.ComponentModel;

namespace EndearingApp.Core.CustomEntityAggregate.DbStructureModels;
public enum SystemTypesEnum
{
    [Description("Integer")]
    Integer = 0,
    [Description("Small Integer")]
    SmallInteger = 1,
    [Description("Big Integer")]
    BigInteger = 2,
    [Description("Decimal")]
    Decimal = 3,
    [Description("Big Integer")]
    Real = 4,
    [Description("Double Precision")]
    Double = 5,
    [Description("Unlimited Text")]
    UnlimitedText = 6,
    [Description("Limited Text")]
    LimitedText = 7,
    [Description("Date")]
    Date = 8,
    [Description("Time")]
    Time = 9,
    [Description("Timestamp")]
    Timestamp = 10,
    [Description("Boolean")]
    Boolean = 11,
    [Description("Binary")]
    Binary = 12,
    [Description("UUID")]
    UUID = 13,
    [Description("OptionSet")]
    OptionSet = 14
}
