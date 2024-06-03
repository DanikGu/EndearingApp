namespace OdataToSqlConvertor;

  using System;
  using System.Collections.Generic;
  using SqlKata;

  /// <summary>
  /// IODataToSqlConverter.
  /// </summary>
  public interface IODataToSqlConverter
  {
      (string, IDictionary<string, object>) ConvertToSQL(
          Uri relativePath,
          bool count = false,
          bool tryToParseDates = true);
  }
