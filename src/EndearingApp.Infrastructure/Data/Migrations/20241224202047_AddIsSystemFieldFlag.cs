using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EndearingApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddIsSystemFieldFlag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsReadOnly",
                schema: "customization",
                table: "Field",
                newName: "IsSystemField");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsSystemField",
                schema: "customization",
                table: "Field",
                newName: "IsReadOnly");
        }
    }
}
