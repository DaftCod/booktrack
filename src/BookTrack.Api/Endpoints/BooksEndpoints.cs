using BookTrack.Application.Books.Queries.GetBookById;
using BookTrack.Application.Books.Queries.GetBooks;
using ErrorOr;
using MediatR;

namespace BookTrack.Api.Endpoints;

public static class BooksEndpoints
{
    public static IEndpointRouteBuilder MapBooksEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/books").WithTags("Books");

        group.MapGet("/", GetBooksAsync);
        group.MapGet("/{id:guid}", GetBookByIdAsync);

        return app;
    }

    private static async Task<IResult> GetBooksAsync(ISender sender, CancellationToken ct)
    {
        var result = await sender.Send(new GetBooksQuery(), ct);
        return result.Match(
            books => Results.Ok(books),
            _ => Results.Problem());
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
}
