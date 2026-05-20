using BookTrack.Application.Books.Commands.AddBook;
using BookTrack.Application.Books.Commands.RemoveBook;
using BookTrack.Application.Books.Queries.GetBookById;
using BookTrack.Application.Books.Queries.GetBooks;
using ErrorOr;
using MediatR;

namespace BookTrack.Api.Endpoints;

public static class BooksEndpoints
{
    private sealed record AddBookRequest(
        string Title,
        string? Isbn,
        int? PublishedYear,
        string? Description,
        string? CoverImageUrl,
        int? PageCount,
        double AverageRating,
        List<string> AuthorNames,
        List<string> GenreNames);

    public static IEndpointRouteBuilder MapBooksEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/books").WithTags("Books");

        group.MapGet("/", GetBooksAsync).AllowAnonymous();
        group.MapGet("/{id:guid}", GetBookByIdAsync).AllowAnonymous();
        group.MapPost("/", AddBookAsync).RequireAuthorization(p => p.RequireRole("Admin"));
        group.MapDelete("/{id:guid}", RemoveBookAsync).RequireAuthorization(p => p.RequireRole("Admin"));

        return app;
    }

    private static async Task<IResult> GetBooksAsync(ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new GetBooksQuery(), ct);
        return result.Match(Results.Ok, _ => Results.Problem());
    }

    private static async Task<IResult> GetBookByIdAsync(Guid id, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new GetBookByIdQuery(id), ct);
        return result.Match(
            book => Results.Ok(book),
            errors => errors.Exists(e => e.Type == ErrorType.NotFound)
                ? Results.NotFound()
                : Results.Problem());
    }

    private static async Task<IResult> AddBookAsync(
        AddBookRequest request, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new AddBookCommand(
            request.Title, request.Isbn, request.PublishedYear, request.Description,
            request.CoverImageUrl, request.PageCount, request.AverageRating,
            request.AuthorNames ?? [], request.GenreNames ?? []), ct);
        return result.Match(
            book => Results.Created($"/api/books/{book.Id}", book),
            _ => Results.Problem());
    }

    private static async Task<IResult> RemoveBookAsync(Guid id, ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new RemoveBookCommand(id), ct);
        return result.Match(
            _ => Results.NoContent(),
            errors => errors.Exists(e => e.Type == ErrorType.NotFound)
                ? Results.NotFound()
                : Results.Problem());
    }
}
