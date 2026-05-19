using System.Security.Claims;
using BookTrack.Application.UserBooks.Commands.AddUserBook;
using BookTrack.Application.UserBooks.Commands.RemoveUserBook;
using BookTrack.Application.UserBooks.Queries.GetUserBooks;
using BookTrack.Domain.Enums;
using ErrorOr;
using MediatR;

namespace BookTrack.Api.Endpoints;

public static class UserBooksEndpoints
{
    private sealed record AddUserBookRequest(Guid BookId, ReadingStatus Status);

    public static IEndpointRouteBuilder MapUserBooksEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/user/books").WithTags("Library").RequireAuthorization();

        group.MapGet("/", GetUserBooksAsync);
        group.MapPost("/", AddUserBookAsync);
        group.MapDelete("/{bookId:guid}", RemoveUserBookAsync);

        return app;
    }

    private static async Task<IResult> GetUserBooksAsync(
        ClaimsPrincipal user, ISender sender, CancellationToken ct)
    {
        var userId = GetUserId(user);
        var result = await sender.Send(new GetUserBooksQuery(userId), ct);
        return result.Match(Results.Ok, _ => Results.Problem());
    }

    private static async Task<IResult> AddUserBookAsync(
        AddUserBookRequest request, ClaimsPrincipal user, ISender sender, CancellationToken ct)
    {
        var userId = GetUserId(user);
        var result = await sender.Send(new AddUserBookCommand(userId, request.BookId, request.Status), ct);
        return result.Match(
            ub => Results.Created($"/api/user/books/{ub.BookId}", ub),
            errors => errors.Exists(e => e.Type == ErrorType.Conflict)
                ? Results.Conflict(errors[0].Description)
                : Results.Problem());
    }

    private static async Task<IResult> RemoveUserBookAsync(
        Guid bookId, ClaimsPrincipal user, ISender sender, CancellationToken ct)
    {
        var userId = GetUserId(user);
        var result = await sender.Send(new RemoveUserBookCommand(userId, bookId), ct);
        return result.Match(
            _ => Results.NoContent(),
            errors => errors.Exists(e => e.Type == ErrorType.NotFound)
                ? Results.NotFound()
                : Results.Problem());
    }

    private static Guid GetUserId(ClaimsPrincipal user)
        => Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
