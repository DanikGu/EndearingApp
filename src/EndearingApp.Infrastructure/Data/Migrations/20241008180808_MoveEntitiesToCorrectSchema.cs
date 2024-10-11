using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EndearingApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class MoveEntitiesToCorrectSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "OptionSetDefinition",
                newName: "OptionSetDefinition",
                newSchema: "customization");

            migrationBuilder.RenameTable(
                name: "FormMetadata",
                newName: "FormMetadata",
                newSchema: "customization");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "OptionSetDefinition",
                schema: "customization",
                newName: "OptionSetDefinition");

            migrationBuilder.RenameTable(
                name: "FormMetadata",
                schema: "customization",
                newName: "FormMetadata");
        }
    }
}
