using BookTrack.Application.Books.Common;
using Microsoft.EntityFrameworkCore;

namespace BookTrack.Infrastructure.Persistence.Repositories;

internal sealed class BookRepository(AppDbContext db) : IBookRepository
{
    public async Task<List<BookDto>> GetAllBooksAsync(CancellationToken cancellationToken = default)
    {
        return await db.Books
            .AsNoTracking()
            .OrderBy(b => b.Title)
            .Select(b => new BookDto(
                b.Id,
                b.Title,
                b.Isbn,
                b.PublishedYear,
                b.Description,
                b.CoverImageUrl,
                b.PageCount,
                b.AverageRating,
                b.Authors.Select(a => new AuthorDto(a.Id, a.FirstName + " " + a.LastName)).ToList(),
                b.Genres.Select(g => new GenreDto(g.Id, g.Name)).ToList()
            ))
            .ToListAsync(cancellationToken);
    }

    public async Task<BookDto?> GetBookByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await db.Books
            .AsNoTracking()
            .Where(b => b.Id == id)
            .Select(b => new BookDto(
                b.Id,
                b.Title,
                b.Isbn,
                b.PublishedYear,
                b.Description,
                b.CoverImageUrl,
                b.PageCount,
                b.AverageRating,
                b.Authors.Select(a => new AuthorDto(a.Id, a.FirstName + " " + a.LastName)).ToList(),
                b.Genres.Select(g => new GenreDto(g.Id, g.Name)).ToList()
            ))
            .FirstOrDefaultAsync(cancellationToken);
    }
}
