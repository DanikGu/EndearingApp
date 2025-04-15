FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app

COPY . ./
RUN dotnet restore
RUN dotnet publish -o out

WORKDIR /app/out

RUN chown -R app:app /app

USER app

ENTRYPOINT ["dotnet", "EndearingApp.Web.dll"]
