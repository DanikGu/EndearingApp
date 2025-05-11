using Endearing.App.Host.OpenTelemetryCollector;

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres").WithDataVolume(isReadOnly: false);
var postgresdb = postgres.AddDatabase("postgresdb");

var prometheus = builder.AddContainer("prometheus", "prom/prometheus", "v3.2.1")
        .WithBindMount("../TelemetryStuff/prometheus", "/etc/prometheus", isReadOnly: true)
        .WithArgs("--web.enable-otlp-receiver", "--config.file=/etc/prometheus/prometheus.yml")
        .WithHttpEndpoint(targetPort: 9090, name: "http");

var loki = builder.AddContainer("loki", "grafana/loki", "3.0.0")
        .WithBindMount("../TelemetryStuff/loki", "/etc/loki", isReadOnly: true)
        .WithVolume("/loki")
        .WithArgs("-config.file=/etc/loki/loki-config.yaml") 
        .WithHttpEndpoint(targetPort: 3100, name: "http");


var tempo = builder.AddContainer("tempo", "grafana/tempo", "latest")
        .WithBindMount("../TelemetryStuff/tempo", "/etc/tempo", isReadOnly: true)
        .WithHttpEndpoint(targetPort: 4318, name: "otlp-http")
        .WithHttpEndpoint(targetPort: 3200, name: "tempo-http")
        .WithHttpEndpoint(targetPort: 14268, name: "jaeger-http")
        .WithArgs("-config.file=/etc/tempo/tempo.yaml");


var grafana = builder.AddContainer("grafana", "grafana/grafana")
        .WithBindMount("../TelemetryStuff/grafana/config", "/etc/grafana", isReadOnly: true)
        .WithBindMount("../TelemetryStuff/grafana/dashboards", "/var/lib/grafana/dashboards", isReadOnly: true)
        .WithEnvironment("PROMETHEUS_ENDPOINT", prometheus.GetEndpoint("http"))
        .WithEnvironment("LOKI_ENDPOINT", loki.GetEndpoint("http"))
        .WithEnvironment("TEMPO_ENDPOINT_GRAFANA", tempo.GetEndpoint("tempo-http"))
        .WithHttpEndpoint(targetPort: 3000, name: "http");


var collector = builder.AddOpenTelemetryCollector("otelcollector", "../TelemetryStuff/otelcollector/config.yaml")
        .WithEnvironment("PROMETHEUS_ENDPOINT", $"{prometheus.GetEndpoint("http")}")
        .WithEnvironment("LOKI_ENDPOINT", loki.GetEndpoint("http"))
        .WithEnvironment("TEMPO_ENDPOINT", $"{tempo.GetEndpoint("otlp-http")}");

var back = builder
        .AddProject<Projects.EndearingApp_Web>("back", launchProfileName: "EndearingApp.Web")
        .WithReference(postgresdb);

var front = builder.AddNpmApp("front", "../EndearingApp.AdminFrontend")
        .WithEndpoint(targetPort: 5173, scheme: "http", name: "http")
        .WithEnvironment("VITE_API_URL", back.GetEndpoint("http"))
        .WithExternalHttpEndpoints()
        .WithReference(back)
        .WaitFor(back)
        .PublishAsDockerFile();

builder.Build().Run();
