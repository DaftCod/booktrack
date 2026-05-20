using BookTrack.Application.Books.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.Books.Commands.AddBook;

public sealed record AddBookCommand(
    string Title,
    string? Isbn,
    int? PublishedYear,
    string? Description,
    string? CoverImageUrl,
    int? PageCount,
    double AverageRating,
    IReadOnlyList<string> AuthorNames,
    IReadOnlyList<string> GenreNames
) : IRequest<ErrorOr<BookDto>>;
