using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EndearingApp.Infrastructure.Data.Migrations;

/// <inheritdoc />
public partial class AddOptionSetDefenitionToField : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<Guid>(
            name: "OptionSetDefinitionId",
            schema: "customization",
            table: "Field",
            type: "uuid",
            nullable: true);

        migrationBuilder.CreateTable(
            name: "OptionSetDefinition",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Name = table.Column<string>(type: "text", nullable: false),
                IsGlobal = table.Column<bool>(type: "boolean", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_OptionSetDefinition", x => x.Id);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Field_OptionSetDefinitionId",
            schema: "customization",
            table: "Field",
            column: "OptionSetDefinitionId");

        migrationBuilder.AddForeignKey(
            name: "FK_Field_OptionSetDefinition_OptionSetDefinitionId",
            schema: "customization",
            table: "Field",
            column: "OptionSetDefinitionId",
            principalTable: "OptionSetDefinition",
            principalColumn: "Id");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Field_OptionSetDefinition_OptionSetDefinitionId",
            schema: "customization",
            table: "Field");

        migrationBuilder.DropTable(
            name: "OptionSetDefinition");

        migrationBuilder.DropIndex(
            name: "IX_Field_OptionSetDefinitionId",
            schema: "customization",
            table: "Field");

        migrationBuilder.DropColumn(
            name: "OptionSetDefinitionId",
            schema: "customization",
            table: "Field");
    }
}
