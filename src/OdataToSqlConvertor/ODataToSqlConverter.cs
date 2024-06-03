namespace OdataToSqlConvertor;

using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.OData.Edm;
using Microsoft.OData.UriParser;
using SqlKata;
using SqlKata.Compilers;

/// <inheritdoc/>
public class ODataToSqlConverter : IODataToSqlConverter
{
  private readonly Compiler _sqlCompiler;
  private readonly IEdmModel _edmModel;

  public ODataToSqlConverter(Compiler sqlCompiler, IEdmModel edmModel)
  {
    _sqlCompiler = sqlCompiler ?? throw new ArgumentNullException(nameof(sqlCompiler));
    _edmModel = edmModel ?? throw new ArgumentNullException(nameof(edmModel));
  }

  public (string, IDictionary<string, object>) ConvertToSQL(
      Uri uri,
      bool count = false,
      bool tryToParseDates = true)
  {
    var query = BuildSqlKataQuery(uri, count, tryToParseDates);
    return CompileSqlKataQuery(query);
  }

  private Query BuildSqlKataQuery(
      Uri uri,
      bool count,
      bool tryToParseDates)
  {

    var parser = GetParser(uri);

    return BuildSqlKataQueryFromParser(parser, count, tryToParseDates);
  }
  private Query BuildSqlKataQueryFromParser(ODataUriParser parser, bool count, bool tryToParseDates)
 {

    Query query = CreateQueryFromPath(parser);
    var applyClause = parser.ParseApply();
    var filterClause = parser.ParseFilter();
    var top = parser.ParseTop();
    var skip = parser.ParseSkip();
    var orderbyClause = parser.ParseOrderBy();
    var selectClause = parser.ParseSelectAndExpand();

    if (applyClause != null)
    {
      query = new ApplyClauseBuilder(this._sqlCompiler).BuildApplyClause(query, applyClause, tryToParseDates);
      if (filterClause != null || selectClause != null)
      {
        query = new Query().From(query, "apply");
      }
    }
    if (filterClause != null)
    {
      query = filterClause.Expression.Accept(new FilterClauseBuilder(query, tryToParseDates));
    }

    if (count)
    {
      query = query.AsCount();
    }
    else
    {
      if (top.HasValue)
      {
        query = query.Take(Convert.ToInt32(top.Value));
      }

      if (skip.HasValue)
      {
        query = query.Skip(Convert.ToInt32(skip.Value));
      }

      if (orderbyClause != null)
      {
        query = BuildOrderByClause(query, orderbyClause);
      }

      if (selectClause != null)
      {
        query = BuildSelectClause(query, selectClause);
        query = BuildExapndClause(query, selectClause);
      }
    }
    return query;
  }
  private ODataUriParser GetParser(Uri relativeUri)
  {
    var parser = new ODataUriParser(_edmModel, relativeUri);
    parser.Resolver.EnableCaseInsensitive = true;
    parser.Resolver.EnableNoDollarQueryOptions = true;
    return parser;
  }
  private (string, IDictionary<string, object>) CompileSqlKataQuery(Query query)
  {
    var sqlResult = _sqlCompiler.Compile(query);
    return (sqlResult.Sql, sqlResult.NamedBindings);
  }
  private Query CreateQueryFromPath(ODataUriParser parser)
  {

    var paths = parser.ParsePath().ToList();
    var entitySetSegment = paths.FirstOrDefault(x => x is EntitySetSegment);
    var entityKeySegment = paths.FirstOrDefault(x => x is KeySegment);
    var propSegment = paths.FirstOrDefault(x => x is PropertySegment);
    var query = new Query(entitySetSegment!.Identifier);
    if (entityKeySegment is not null)
    {
      var keySegment = entityKeySegment as KeySegment;
      foreach (var key in keySegment!.Keys)
      {
        query.Where(key.Key, key.Value);
      }
    }
    if (propSegment is not null)
    {
      query.Select(propSegment.Identifier);
    }
    return query;
  }
  private static Query BuildOrderByClause(Query query, OrderByClause orderbyClause)
  {
    while (orderbyClause != null)
    {
      var direction = orderbyClause.Direction;
      if (orderbyClause.Expression is SingleValueOpenPropertyAccessNode expression)
      {
        if (direction == OrderByDirection.Ascending)
        {
          query = query.OrderBy(expression.Name.Trim());
        }
        else
        {
          query = query.OrderByDesc(expression.Name.Trim());
        }
      }

      orderbyClause = orderbyClause.ThenBy;
    }

    return query;
  }

  private static Query BuildSelectClause(Query query, SelectExpandClause selectClause)
  {
    if (!selectClause.AllSelected)
    {
      foreach (var selectItem in selectClause.SelectedItems)
      {
        if (selectItem is PathSelectItem path)
        {
          query = query.Select(path.SelectedPath.FirstSegment.Identifier.Trim());
        }
      }
    }

    return query;
  }
  private static Query BuildExapndClause(Query query, SelectExpandClause selectClause)
  {
    if (!selectClause.AllSelected)
    {
      foreach (var selectItem in selectClause.SelectedItems)
      {
        if (selectItem is ExpandedReferenceSelectItem path)
        {
          //int i = 0;

        }
      }
    }

    return query;

  }
}
