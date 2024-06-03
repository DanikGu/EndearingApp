#create dev docker db 
docker run -d   --name EndearingApp-db     -e POSTGRES_DB=EndearingApp     -e POSTGRES_USER=postgres     -e POSTGRES_PASSWORD=postgres     -p 5500:5432     postgres


#Add Migartion

dotnet ef migrations add MIGRATIONNAME -c AppDbContext -p ../EndearingApp.Infrastructure/EndearingApp.Infrastructure.csproj -s EndearingApp.Web.csproj -o Data/Migrations


dotnet ef database update -c AppDbContext -p ../EndearingApp.Infrastructure/EndearingApp.Infrastructure.csproj -s EndearingApp.Web.csproj






#default dbtypes setting for postgres 
{
   "typesConfig": {
    "0": {
      "Name": "Whole Number",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": true
    },
    "1": {
      "Name": "Whole Number (Small)",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": true
    },
    "2": {
      "Name": "Whole Number (Big)",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": true
    },
    "3": {
      "Name": "Decimal Number",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": false
    },
    "4": {
      "Name": "Real Number",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": false
    },
    "5": {
      "Name": "Double Precision Number",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": false
    },
    "6": {
      "Name": "Unlimited Text",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": false
    },
    "7": {
      "Name": "Limited Text",
      "IsSizeAplicable": true,
      "IsPrimaryKeyAplicable": false
    },
    "8": {
      "Name": "Date",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": false
    },
    "9": {
      "Name": "Time",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": false
    },
    "10": {
      "Name": "Date and Time",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": false
    },
    "11": {
      "Name": "Yes/No",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": false
    },
    "12": {
      "Name": "Binary Data",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": false
    },
    "13": {
      "Name": "Unique Identifier",
      "IsSizeAplicable": false,
      "IsPrimaryKeyAplicable": true
    }
  },
  "descriptions": {
    "Whole Number": "Positive or negative whole numbers without decimal fractions.",
    "Whole Number (Small)": "Small positive or negative whole numbers without decimal fractions.",
    "Whole Number (Big)": "Large positive or negative whole numbers without decimal fractions.",
    "Decimal Number": "Numbers with decimal fractions, allowing for precise values.",
    "Real Number": "Single-precision floating point numbers, suitable for approximate values.",
    "Double Precision Number": "Double-precision floating point numbers, suitable for precise values.",
    "Unlimited Text": "Unlimited-length string data, suitable for large amounts of text.",
    "Limited Text": "String data with a specified maximum length, suitable for smaller text fields.",
    "Date": "Calendar dates in the format YYYY-MM-DD.",
    "Time": "Times of day in the format HH:MM:SS.",
    "Date and Time": "Timestamps representing both date and time in the format YYYY-MM-DD HH:MM:SS.",
    "Yes/No": "Boolean values representing true or false.",
    "Binary Data": "Arbitrary binary data, such as images or files.",
    "Unique Identifier": "Universally unique identifiers, typically used as primary keys."
  }
}
