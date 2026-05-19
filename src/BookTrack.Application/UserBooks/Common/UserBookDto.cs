using BookTrack.Application.Books.Common;
using BookTrack.Domain.Enums;

namespace BookTrack.Application.UserBooks.Common;

public sealed record UserBookDto(
    Guid Id,
    Guid BookId,
    string Title,
    string? CoverImageUrl,
    IReadOnlyList<AuthorDto> Authors,
    ReadingStatus Status,
    DateTime AddedAt
);
