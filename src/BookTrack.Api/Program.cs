using BookTrack.Api.Endpoints;
using BookTrack.Application;
using BookTrack.Infrastructure;
using BookTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((ctx, lc) => lc
        .ReadFrom.Configuration(ctx.Configuration)
        .Enrich.FromLogContext());

    builder.Services
        .AddOpenTelemetry()
        .ConfigureResource(r => r.AddService(
            serviceName: "BookTrack.Api",
            serviceVersion: typeof(BookTrack.Api.AssemblyReference).Assembly.GetName().Version?.ToString() ?? "0.0.0"))
        .WithTracing(t => t
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddOtlpExporter(o =>
                o.Endpoint = new Uri(
                    builder.Configuration["Telemetry:OtlpEndpoint"] ?? "http://localhost:4317")));

    builder.Services.AddCors(options =>
        options.AddDefaultPolicy(policy =>
            policy.SetIsOriginAllowed(_ => true)
                  .AllowAnyHeader()
                  .AllowAnyMethod()));

    builder.Services.AddHealthChecks();
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    var app = builder.Build();

    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();
    }

    app.UseCors();
    app.UseSerilogRequestLogging();
    app.MapHealthChecks("/health");
    app.MapBooksEndpoints();

    app.Run();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
