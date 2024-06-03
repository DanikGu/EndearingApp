using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EndearingApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeFieldUniqueIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Field_Name",
                schema: "customization",
                table: "Field"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Field_Name_CustomEntityId",
                schema: "customization",
                table: "Field",
                columns: new[] { "Name", "CustomEntityId" },
                unique: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Field_Name_CustomEntityId",
                schema: "customization",
                table: "Field"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Field_Name",
                schema: "customization",
                table: "Field",
                column: "Name",
                unique: true
            );
        }
    }
}
