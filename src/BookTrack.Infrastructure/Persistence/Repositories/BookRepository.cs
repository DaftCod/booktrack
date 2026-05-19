using BookTrack.Application.Books.Common;
using BookTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookTrack.Infrastructure.Persistence.Repositories;

internal sealed class BookRepository(AppDbContext db) : IBookRepository
{
    public async Task<List<BookDto>> GetAllBooksAsync(CancellationToken cancellationToken = default)
        => await db.Books
            .AsNoTracking()
            .OrderBy(b => b.Title)
            .Select(b => new BookDto(
                b.Id, b.Title, b.Isbn, b.PublishedYear, b.Description, b.CoverImageUrl, b.PageCount,
                b.AverageRating,
                b.Authors.Select(a => new AuthorDto(a.Id, a.FirstName + " " + a.LastName)).ToList(),
                b.Genres.Select(g => new GenreDto(g.Id, g.Name)).ToList()))
            .ToListAsync(cancellationToken);

    public async Task<BookDto?> GetBookByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await db.Books
            .AsNoTracking()
            .Where(b => b.Id == id)
            .Select(b => new BookDto(
                b.Id, b.Title, b.Isbn, b.PublishedYear, b.Description, b.CoverImageUrl, b.PageCount,
                b.AverageRating,
                b.Authors.Select(a => new AuthorDto(a.Id, a.FirstName + " " + a.LastName)).ToList(),
                b.Genres.Select(g => new GenreDto(g.Id, g.Name)).ToList()))
            .FirstOrDefaultAsync(cancellationToken);

    public async Task<BookDto> AddBookAsync(
        string title, string? isbn, int? publishedYear, string? description,
        string? coverImageUrl, int? pageCount,
        IReadOnlyList<string> authorNames, IReadOnlyList<string> genreNames,
        CancellationToken cancellationToken = default)
    {
        var genres = new List<Genre>();
        foreach (var name in genreNames)
        {
            var g = await db.Genres.FirstOrDefaultAsync(x => x.Name == name, cancellationToken);
            if (g is null) { g = new Genre { Id = Guid.NewGuid(), Name = name }; db.Genres.Add(g); }
            genres.Add(g);
        }

        var authors = new List<Author>();
        foreach (var fullName in authorNames)
        {
            var trimmed = fullName.Trim();
            var idx = trimmed.IndexOf(' ');
            var firstName = idx > 0 ? trimmed[..idx] : trimmed;
            var lastName  = idx > 0 ? trimmed[(idx + 1)..] : string.Empty;
            var a = await db.Authors.FirstOrDefaultAsync(
                x => x.FirstName == firstName && x.LastName == lastName, cancellationToken);
            if (a is null) { a = new Author { Id = Guid.NewGuid(), FirstName = firstName, LastName = lastName }; db.Authors.Add(a); }
            authors.Add(a);
        }

        var book = new Book
        {
            Id = Guid.NewGuid(),
            Title = title, Isbn = isbn, PublishedYear = publishedYear,
            Description = description, CoverImageUrl = coverImageUrl, PageCount = pageCount,
            Authors = authors, Genres = genres,
        };
        db.Books.Add(book);
        await db.SaveChangesAsync(cancellationToken);

        return new BookDto(
            book.Id, book.Title, book.Isbn, book.PublishedYear, book.Description,
            book.CoverImageUrl, book.PageCount, book.AverageRating,
            authors.Select(a => new AuthorDto(a.Id, (a.FirstName + " " + a.LastName).Trim())).ToList(),
            genres.Select(g => new GenreDto(g.Id, g.Name)).ToList());
    }

    public async Task<bool> RemoveBookAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var book = await db.Books.FindAsync([id], cancellationToken);
        if (book is null) return false;
        db.Books.Remove(book);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
