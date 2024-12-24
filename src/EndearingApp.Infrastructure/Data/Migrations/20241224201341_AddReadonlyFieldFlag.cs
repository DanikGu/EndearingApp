using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EndearingApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddReadonlyFieldFlag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
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
                name: "IsReadOnly",
                schema: "customization",
                table: "Field");
        }
    }
}
