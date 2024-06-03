using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EndearingApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCommit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(name: "customization");

            migrationBuilder.CreateTable(
                name: "CustomEntity",
                schema: "customization",
                columns: table =>
                    new
                    {
                        Id = table.Column<Guid>(type: "uuid", nullable: false),
                        Name = table.Column<string>(
                            type: "character varying(100)",
                            maxLength: 100,
                            nullable: false
                        )
                    },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomEntity", x => x.Id);
                }
            );

            migrationBuilder.CreateTable(
                name: "SystemSetting",
                schema: "customization",
                columns: table =>
                    new
                    {
                        Id = table.Column<Guid>(type: "uuid", nullable: false),
                        Name = table.Column<string>(
                            type: "character varying(100)",
                            maxLength: 100,
                            nullable: false
                        ),
                        Description = table.Column<string>(type: "text", nullable: true),
                        JsonSetting = table.Column<string>(type: "jsonb", nullable: true)
                    },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSetting", x => x.Id);
                }
            );

            migrationBuilder.CreateTable(
                name: "Field",
                schema: "customization",
                columns: table =>
                    new
                    {
                        Id = table.Column<Guid>(type: "uuid", nullable: false),
                        Name = table.Column<string>(
                            type: "character varying(100)",
                            maxLength: 100,
                            nullable: false
                        ),
                        Type = table.Column<int>(type: "integer", nullable: false),
                        Size = table.Column<int>(type: "integer", nullable: true),
                        IsPrimaryKey = table.Column<bool>(type: "boolean", nullable: false),
                        CustomEntityId = table.Column<Guid>(type: "uuid", nullable: false)
                    },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Field", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Field_CustomEntity_CustomEntityId",
                        column: x => x.CustomEntityId,
                        principalSchema: "customization",
                        principalTable: "CustomEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateTable(
                name: "Relationship",
                schema: "customization",
                columns: table =>
                    new
                    {
                        Id = table.Column<Guid>(type: "uuid", nullable: false),
                        SourceCustomEntityId = table.Column<Guid>(type: "uuid", nullable: false),
                        SourceFieldId = table.Column<Guid>(type: "uuid", nullable: false),
                        ReferencedCustomEntityId = table.Column<Guid>(
                            type: "uuid",
                            nullable: false
                        ),
                        ReferencedFieldId = table.Column<Guid>(type: "uuid", nullable: false),
                        ConstraintName = table.Column<string>(
                            type: "character varying(100)",
                            maxLength: 100,
                            nullable: false
                        )
                    },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Relationship", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Relationship_CustomEntity_ReferencedCustomEntityId",
                        column: x => x.ReferencedCustomEntityId,
                        principalSchema: "customization",
                        principalTable: "CustomEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_Relationship_CustomEntity_SourceCustomEntityId",
                        column: x => x.SourceCustomEntityId,
                        principalSchema: "customization",
                        principalTable: "CustomEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_Relationship_Field_ReferencedFieldId",
                        column: x => x.ReferencedFieldId,
                        principalSchema: "customization",
                        principalTable: "Field",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_Relationship_Field_SourceFieldId",
                        column: x => x.SourceFieldId,
                        principalSchema: "customization",
                        principalTable: "Field",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_CustomEntity_Name",
                schema: "customization",
                table: "CustomEntity",
                column: "Name",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_Field_CustomEntityId",
                schema: "customization",
                table: "Field",
                column: "CustomEntityId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Field_Name",
                schema: "customization",
                table: "Field",
                column: "Name",
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_Relationship_ReferencedCustomEntityId",
                schema: "customization",
                table: "Relationship",
                column: "ReferencedCustomEntityId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Relationship_ReferencedFieldId",
                schema: "customization",
                table: "Relationship",
                column: "ReferencedFieldId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Relationship_SourceCustomEntityId",
                schema: "customization",
                table: "Relationship",
                column: "SourceCustomEntityId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Relationship_SourceFieldId",
                schema: "customization",
                table: "Relationship",
                column: "SourceFieldId"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Relationship", schema: "customization");

            migrationBuilder.DropTable(name: "SystemSetting", schema: "customization");

            migrationBuilder.DropTable(name: "Field", schema: "customization");

            migrationBuilder.DropTable(name: "CustomEntity", schema: "customization");
        }
    }
}
