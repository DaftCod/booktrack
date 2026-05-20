namespace BookTrack.Application.Books.Common;

public sealed record AuthorDto(Guid Id, string FullName);

public sealed record GenreDto(Guid Id, string Name);

public sealed record BookDto(
    Guid Id,
    string Title,
    string? Isbn,
    int? PublishedYear,
    string? Description,
    string? CoverImageUrl,
    int? PageCount,
    double AverageRating,
    IReadOnlyList<AuthorDto> Authors,
    IReadOnlyList<GenreDto> Genres
);
