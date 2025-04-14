FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app

# Copy and build
COPY . ./
RUN dotnet restore
RUN dotnet publish -o out

# Change the working directory to your published output
WORKDIR /app/out
RUN chown -R app:app /app
USER app
ENTRYPOINT ["dotnet", "EndearingApp.Web.dll"]


