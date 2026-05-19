namespace BookTrack.Application.Books.Common;

public interface IBookRepository
{
    Task<List<BookDto>> GetAllBooksAsync(CancellationToken cancellationToken = default);
    Task<BookDto?> GetBookByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
