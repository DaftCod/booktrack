using BookTrack.Application.Auth.Commands.Login;
using BookTrack.Application.Auth.Commands.Register;
using ErrorOr;
using MediatR;

namespace BookTrack.Api.Endpoints;

public static class AuthEndpoints
{
    private sealed record LoginRequest(string Username, string Password);
    private sealed record RegisterRequest(string Username, string Password);

    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth").AllowAnonymous();

        group.MapPost("/login", LoginAsync);
        group.MapPost("/register", RegisterAsync);

        return app;
    }

    private static async Task<IResult> LoginAsync(
        LoginRequest request, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new LoginCommand(request.Username, request.Password), ct);
        return result.Match(
            auth => Results.Ok(auth),
            errors => errors.Exists(e => e.Type == ErrorType.Unauthorized)
                ? Results.Unauthorized()
                : Results.Problem(errors[0].Description));
    }

    private static async Task<IResult> RegisterAsync(
        RegisterRequest request, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new RegisterCommand(request.Username, request.Password), ct);
        return result.Match(
            auth => Results.Ok(auth),
            errors => Results.ValidationProblem(
                errors.ToDictionary(e => e.Code, e => new[] { e.Description })));
    }
}
