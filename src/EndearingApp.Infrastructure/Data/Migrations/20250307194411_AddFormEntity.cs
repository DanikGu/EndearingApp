using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EndearingApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFormEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Form",
                schema: "customization",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    JsonSchema = table.Column<string>(type: "jsonb", nullable: false),
                    CustomEntityId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Form", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Form_CustomEntity_CustomEntityId",
                        column: x => x.CustomEntityId,
                        principalSchema: "customization",
                        principalTable: "CustomEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Form_CustomEntityId",
                schema: "customization",
                table: "Form",
                column: "CustomEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_Form_Name",
                schema: "customization",
                table: "Form",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Form",
                schema: "customization");
        }
    }
}
