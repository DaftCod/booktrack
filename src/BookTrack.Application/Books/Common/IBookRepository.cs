namespace BookTrack.Application.Books.Common;

public interface IBookRepository
{
    Task<List<BookDto>> GetAllBooksAsync(CancellationToken cancellationToken = default);
    Task<BookDto?> GetBookByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<BookDto> AddBookAsync(
        string title,
        string? isbn,
        int? publishedYear,
        string? description,
        string? coverImageUrl,
        int? pageCount,
        IReadOnlyList<string> authorNames,
        IReadOnlyList<string> genreNames,
        CancellationToken cancellationToken = default);
    Task<bool> RemoveBookAsync(Guid id, CancellationToken cancellationToken = default);
}
