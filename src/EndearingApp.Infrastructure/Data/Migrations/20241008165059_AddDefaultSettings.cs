using Microsoft.EntityFrameworkCore.Migrations;
using static EndearingApp.Core.SystemSettingsAggregate.Consts;

#nullable disable

namespace EndearingApp.Infrastructure.Data.Migrations;

/// <inheritdoc />
public partial class AddDefaultSettings : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.InsertData(
            table: "SystemSetting",
            columns: new[] { "Id", "Name", "JsonSetting" },
            values: new object[,]
            {
                {
                    Guid.NewGuid(),
                    SettingNames.DataBaseTypesDescription,
                    "{\"0\":{\"Name\":\"Whole Number\",\"Description\":\"Positive or negative whole numbers without decimal fractions.\",\"IsSizeAplicable\":false},\"1\":{\"Name\":\"Whole Number (Small)\",\"Description\":\"Small positive or negative whole numbers without decimal fractions.\",\"IsSizeAplicable\":false},\"2\":{\"Name\":\"Whole Number (Big)\",\"Description\":\"Large positive or negative whole numbers without decimal fractions.\",\"IsSizeAplicable\":false},\"3\":{\"Name\":\"Decimal Number\",\"Description\":\"Numbers with decimal fractions, allowing for precise values.\",\"IsSizeAplicable\":false},\"4\":{\"Name\":\"Real Number\",\"Description\":\"Single-precision floating point numbers, suitable for approximate values.\",\"IsSizeAplicable\":false},\"5\":{\"Name\":\"Double Precision Number\",\"Description\":\"Double-precision floating point numbers, suitable for precise values.\",\"IsSizeAplicable\":false},\"6\":{\"Name\":\"Unlimited Text\",\"Description\":\"Unlimited-length string data, suitable for large amounts of text.\",\"IsSizeAplicable\":false},\"7\":{\"Name\":\"Limited Text\",\"Description\":\"String data with a specified maximum length, suitable for smaller text fields.\",\"IsSizeAplicable\":true},\"8\":{\"Name\":\"Date\",\"Description\":\"Calendar dates in the format YYYY-MM-DD.\",\"IsSizeAplicable\":false},\"9\":{\"Name\":\"Time\",\"Description\":\"Times of day in the format HH:MM:SS.\",\"IsSizeAplicable\":false},\"10\":{\"Name\":\"Date and Time\",\"Description\":\"Timestamps representing both date and time in the format YYYY-MM-DD HH:MM:SS.\",\"IsSizeAplicable\":false},\"11\":{\"Name\":\"Yes/No\",\"Description\":\"Boolean values representing true or false.\",\"IsSizeAplicable\":false},\"12\":{\"Name\":\"Binary Data\",\"Description\":\"Arbitrary binary data, such as images or files.\",\"IsSizeAplicable\":false},\"13\":{\"Name\":\"Unique Identifier\",\"Description\":\"Universally unique identifiers, typically used as primary keys.\",\"IsSizeAplicable\":false},\"14\":{\"Name\":\"Option Set\",\"Description\":\"A predefined set of selectable options, where only one option can be chosen.\",\"IsSizeAplicable\":false},\"15\":{\"Name\":\"Option Set MultiSelect\",\"Description\":\"A predefined set of selectable options, where multiple options can be selected.\",\"IsSizeAplicable\":false}}",
                },
            },
            schema: "customization"
        );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DeleteData(
            table: "SystemSetting",
            keyColumn: "Name",
            keyValues: new object[] { SettingNames.DataBaseTypesDescription },
            schema: "customization"
        );
    }
}
