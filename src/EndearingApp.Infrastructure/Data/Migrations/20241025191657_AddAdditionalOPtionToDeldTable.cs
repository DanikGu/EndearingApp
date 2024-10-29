using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EndearingApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAdditionalOPtionToDeldTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsIndexed",
                schema: "customization",
                table: "Field",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsNullable",
                schema: "customization",
                table: "Field",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsRequired",
                schema: "customization",
                table: "Field",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsUnique",
                schema: "customization",
                table: "Field",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsIndexed",
                schema: "customization",
                table: "Field");

            migrationBuilder.DropColumn(
                name: "IsNullable",
                schema: "customization",
                table: "Field");

            migrationBuilder.DropColumn(
                name: "IsRequired",
                schema: "customization",
                table: "Field");

            migrationBuilder.DropColumn(
                name: "IsUnique",
                schema: "customization",
                table: "Field");
        }
    }
}
