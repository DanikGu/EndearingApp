FROM mcr.microsoft.com/dotnet/sdk:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Ensure the 'app' user (created by default in MS images) owns the directory
RUN chown -R app:app /app

USER app
ENTRYPOINT ["dotnet", "EndearingApp.Web.dll"]