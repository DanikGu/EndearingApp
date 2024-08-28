﻿using System.Text;
using EndearingApp.Core.CustomEntityAggregate.Interfaces;
using EndearingApp.Core.CustomEntityAggregate.DbStructureModels;
using CliWrap;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using EndearingApp.Core.CustomDataAccsess.Interfaces;

namespace EndearingApp.Infrastructure.Data.CustomDataAccess;
public class DatabaseStructureUpdater : IDatabaseStructureUpdater
{
    private readonly AppDbContext _appDbContext;
    private readonly ICustomEntityDataProvider _customEntityQueryDataProvider;
    private readonly ILogger? _logger;

    public DatabaseStructureUpdater(AppDbContext appDbContext, ICustomEntityDataProvider customEntityQueryDataProvider)
    {
        _appDbContext = appDbContext;
        _customEntityQueryDataProvider = customEntityQueryDataProvider;
        _logger = null;
    }
    public async Task UpdateDbStructure(DbStructure dbStructure)
    {
        var connectionString = _appDbContext.Database.GetConnectionString();
        if (connectionString is null)
        {
            throw new ArgumentNullException(nameof(connectionString));
        }
        var projectName = "CustomEntitiesDbContext";
        var dbContextName = "AppDbContext";
        var appContextText = GetAllTablesClasses(projectName, dbContextName, dbStructure, connectionString!);
        var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, projectName);
        _customEntityQueryDataProvider.FreePreviousAssembly();
        await CreateUpdateProjectMigrationsAndApplyThem(appContextText, projectName, path);
        _customEntityQueryDataProvider.ReloadDbContextAsseblies();
    }
    private async Task CreateUpdateProjectMigrationsAndApplyThem(string appContext, 
        string projectName, string folderPath)
    {
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
            await CallDotnetCli($"new classlib --name {projectName} --output \"{folderPath}\" ", folderPath);
            await CallDotnetCli("add package Npgsql.EntityFrameworkCore.PostgreSQL -v 8.0.4", folderPath);
            await CallDotnetCli("add package Microsoft.OData.ModelBuilder -v 1.0.9", folderPath);
            await CallDotnetCli("add package Microsoft.EntityFrameworkCore.Design", folderPath);
            File.WriteAllText(folderPath + "\\AppContext.cs", appContext);
            File.Delete(folderPath + "\\Class1.cs");
            await CallDotnetCli("ef migrations add InitialCreate", folderPath);
            ClearInitialMigration(folderPath + "\\Migrations\\");
            await CallDotnetCli("ef database update", folderPath);
        }
        File.WriteAllText(folderPath + "\\AppContext.cs", appContext);
        await CallDotnetCli("ef migrations add " + GetNewMigrationName(), folderPath);
        await CallDotnetCli("ef database update", folderPath);
        await CallDotnetCli("dotnet publish", folderPath);
    }
    private void ClearInitialMigration(string migrationFolder) 
    {
        var files = Directory.GetFiles(migrationFolder);
        var migratonFile = files.FirstOrDefault(x => x.Contains("InitialCreate.cs"));
        if (migratonFile is null) 
        {
            throw new ArgumentException("Migration is not found");
        }
        var fileText = File.ReadAllText(migratonFile);
        fileText = RemoveFunctionBody(fileText, "Up(MigrationBuilder migrationBuilder)");
        fileText = RemoveFunctionBody(fileText, "Down(MigrationBuilder migrationBuilder)");
        File.WriteAllText(migratonFile, fileText);
    }
    private string RemoveFunctionBody(string fileText, string functionStart)
    {
        var upIndex = fileText.IndexOf(functionStart);
        var startDeletionIndex = fileText.IndexOf('{', upIndex);
        int openBracketsCount = 0;
        int indexToEndDeletion = -1;
        for (int i = startDeletionIndex; i < fileText.Length; i++)
        {
            if (fileText[i] == '{')
            {
                openBracketsCount++;
            }
            else if (fileText[i] == '}')
            {
                openBracketsCount--;
            }
            if (openBracketsCount == 0)
            {
                indexToEndDeletion = i;
                break;
            }
        }
        if (indexToEndDeletion == -1)
        {
            throw new Exception("Something wrong I can feel it");
        }
        fileText = fileText.Substring(0, startDeletionIndex + 1) + fileText.Substring(indexToEndDeletion);
        return fileText;
    }
    private async Task CallDotnetCli(string command, string folderPath)
    {
        await Cli.Wrap("dotnet")
            .WithArguments(command)
            .WithWorkingDirectory(folderPath)
            .WithStandardOutputPipe(PipeTarget.ToDelegate((message) =>
            {
                Debug.WriteLine(message);
                _logger?.LogInformation(message);
            }))
            .WithStandardErrorPipe(PipeTarget.ToDelegate((message) =>
            {
                Debug.WriteLine(message);
                _logger?.LogError(message);
            }))
            .ExecuteAsync();
    }
    private string GetNewMigrationName()
    {
        return "updateState" +
                DateTime.UtcNow.ToString().Replace(" ", "_").Replace(".", "").Replace(":", "");
    }
    private string GetAllTablesClasses(string ns, string dbContextName, DbStructure dbStructure, string connectionString)
    {

        var result = new StringBuilder();
        result.AppendLine("#nullable disable");
        result.AppendLine("using System.ComponentModel.DataAnnotations.Schema;");
        result.AppendLine("using System.ComponentModel.DataAnnotations;");
        result.AppendLine("using Microsoft.EntityFrameworkCore;");
        result.AppendLine("using Microsoft.EntityFrameworkCore.Metadata.Builders;");
        result.AppendLine("using System.Collections.Generic;");
        result.AppendLine("using System.Reflection;");
        result.AppendLine("using System;");
        result.AppendLine("using Microsoft.OData.ModelBuilder;");
        result.AppendLine("using System.Linq;");


        result.Append("namespace ").Append(ns).Append(";\n");
        foreach (var table in dbStructure!.Tables!)
        {
            var relationshipsToThisTable = dbStructure.Tables
                .SelectMany(x => x.Relationships.Where(y => y.ReferencedTable == table))
                .ToArray();
            var @class = GenerateDbModelClass(table, relationshipsToThisTable);
            result.Append(@class);
        }
        result.Append('\n');
        result.Append(GenerateDbContext(dbContextName, dbStructure, connectionString));
        return result.ToString();
    }

    private StringBuilder GenerateDbContext(string dbContextName, DbStructure dbStructure, string connectionString)
    {
        var result = new StringBuilder();
        result.AppendFormat("public class {0}: DbContext\n{{\n", dbContextName);
        result.AppendFormat("protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => " +
            "optionsBuilder.UseNpgsql(\"{0}\");", connectionString);
        result.AppendLine("""
           protected override void OnModelCreating(ModelBuilder modelBuilder)
           {
                modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
           }
        """);
        foreach (var table in dbStructure!.Tables!)
        {
            result.AppendFormat("public DbSet<{0}> {0} {{ get; set; }}\n", table.Name);
        }
        result.Append("}\n");
        return result;
    }
    private StringBuilder GenerateDbModelClass(Table table, Relationship[] toThisTable)
    {
        var result = new StringBuilder();

        result.AppendLine("[Select(SelectType = SelectExpandType.Allowed)]");
        result.AppendLine("[Filter]");
        result.AppendLine("[Count]");
        result.AppendLine("[Expand(ExpandType = SelectExpandType.Allowed)]");
        result.AppendLine("[OrderBy]");
        result.AppendFormat("[Table(\"{0}\")]\n", table.Name);
        result.Append("public class ").Append(table.Name).Append("\n{\n");
        foreach (var field in table.Fields)
        {
            var relationship = table.Relationships.FirstOrDefault(x => x.Field == field);
            result.AppendFormat("public {0} {1} {{ get; set; }}\n",
                MapSystemTypeToCSharpType(field.Type),
                field.Name);
            if (relationship is not null)
            {
                result.AppendFormat("public {0} {0}_Etn {{ get; set; }}\n", relationship!.ReferencedTable!.Name);
            }
        }
        foreach (var relationship in toThisTable)
        {
            result.AppendFormat("public ICollection<{0}> {0}_EtnColl {{ get; set; }}\n", relationship!.Table!.Name);
        }

        result.Append("}\n");
        var configClass = GetTableConfigurationClass(table, toThisTable);
        result.Append(configClass);
        return result;
    }
    private StringBuilder GetTableConfigurationClass(Table table, Relationship[] toThisTable)
    {
        var result = new StringBuilder();
        var fieldsConfig = new StringBuilder();
        foreach (var field in table.Fields)
        {
            fieldsConfig.
                AppendFormat("builder").
                AppendFormat(".Property(t => t.{0})\n", field.Name);

            if (field.Size is not null)
            {
                fieldsConfig.AppendFormat(".HasMaxLength({0})\n", field.Size);
            }
            if (field.DefaultValue is not null)
            {
                fieldsConfig.AppendFormat(".HasDefaultValue({0})\n", field.DefaultValue);
            }
            if (field.IsRequired)
            {
                fieldsConfig.AppendFormat(".IsRequired()");
            }
            fieldsConfig.Append(";\n");
        }
        foreach (var index in table.Fields.Where(x => x.IsIndexed))
        {
            fieldsConfig.
                AppendFormat("builder").
                AppendFormat(".HasIndex(b => b.{0})", index.Name);
            if (index.IsUnique)
            {
                fieldsConfig.
                    AppendFormat(".IsUnique()");
            }
            fieldsConfig.Append(";\n");
        }
        foreach (var index in table.Fields.Where(x => !x.IsIndexed && x.IsUnique))
        {
            fieldsConfig.
                AppendFormat("builder").
                AppendFormat(".HasAlternateKey(b => b.{0})", index.Name);
            fieldsConfig.Append(";\n");
        }
        var primaryKey = table.Fields.First(x => x.IsPrimaryKey);
        fieldsConfig.
            AppendFormat("builder").
            AppendFormat(".HasKey(b => b.{0})", primaryKey.Name);
        fieldsConfig.Append(";\n");
        foreach (var rel in table.Relationships)
        {
            fieldsConfig.
                AppendFormat("builder").
                AppendFormat(".HasOne(b => b.{0})\n", rel!.ReferencedTable!.Name + "_Etn").
                AppendFormat(".WithMany(b => b.{0})\n", rel!.Table!.Name + "_EtnColl").
                AppendFormat(".HasForeignKey(b => b.{0})\n", rel!.Field!.Name).
                AppendFormat(".HasPrincipalKey(b => b.{0})\n", rel!.ReferencedField!.Name);
            if (rel.ConstraintName is not null)
            {
                fieldsConfig.
                    AppendFormat(".HasConstraintName(\"{0}\")", rel.ConstraintName);
            }
            fieldsConfig.
                AppendFormat(".OnDelete({0})", MapDeleteBehaviorToEfCoreEnum(rel.DeleteBehavior));
            fieldsConfig.Append(";\n");

        }
        result.AppendFormat("""
            public class {0}Configuration : IEntityTypeConfiguration<{0}>
            {{
                public void Configure(EntityTypeBuilder<{0}> builder)
                {{
                    {1}
                }}
            }}
        """, table.Name, fieldsConfig);
        return result;
    }

    private string MapSystemTypeToCSharpType(SystemTypesEnum systemType)
    {
        return systemType switch
        {
            SystemTypesEnum.Integer => "int",
            SystemTypesEnum.SmallInteger => "short",
            SystemTypesEnum.BigInteger => "long",
            SystemTypesEnum.Decimal => "decimal",
            SystemTypesEnum.Real => "float",
            SystemTypesEnum.Double => "double",
            SystemTypesEnum.UnlimitedText => "string",
            SystemTypesEnum.LimitedText => "string",
            SystemTypesEnum.Date => "DateTime",
            SystemTypesEnum.Time => "TimeSpan",
            SystemTypesEnum.Timestamp => "DateTime",
            SystemTypesEnum.Boolean => "bool",
            SystemTypesEnum.Binary => "byte[]",
            SystemTypesEnum.UUID => "Guid",
            _ => throw new ArgumentOutOfRangeException(nameof(systemType), systemType, null)
        };
    }
    private string MapDeleteBehaviorToEfCoreEnum(RelationshipDeleteBehavior deleteBehavior)
    {
        return deleteBehavior switch
        {
            RelationshipDeleteBehavior.Cascade => "DeleteBehavior.Cascade",
            RelationshipDeleteBehavior.SetNull => "DeleteBehavior.SetNull",
            RelationshipDeleteBehavior.Restrict => "DeleteBehavior.Restrict",
            RelationshipDeleteBehavior.NoAction => "DeleteBehavior.NoAction",
            _ => "DeleteBehavior.SetNull"
        };
    }
}