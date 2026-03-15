using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EndearingApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMigrationHistoryFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedOn",
                schema: "customization",
                table: "MigrationHistory",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<string>(
                name: "MigrationDesignerContent",
                schema: "customization",
                table: "MigrationHistory",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SnapshotContent",
                schema: "customization",
                table: "MigrationHistory",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedOn",
                schema: "customization",
                table: "MigrationHistory");

            migrationBuilder.DropColumn(
                name: "MigrationDesignerContent",
                schema: "customization",
                table: "MigrationHistory");

            migrationBuilder.DropColumn(
                name: "SnapshotContent",
                schema: "customization",
                table: "MigrationHistory");
        }
    }
}
