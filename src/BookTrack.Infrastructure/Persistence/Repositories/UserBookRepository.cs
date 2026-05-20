using BookTrack.Application.Books.Common;
using BookTrack.Application.UserBooks.Common;
using BookTrack.Domain.Entities;
using BookTrack.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace BookTrack.Infrastructure.Persistence.Repositories;

internal sealed class UserBookRepository(AppDbContext db) : IUserBookRepository
{
    public async Task<List<UserBookDto>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
        => await db.UserBooks
            .AsNoTracking()
            .Where(ub => ub.UserId == userId)
            .OrderByDescending(ub => ub.AddedAt)
            .Select(ub => new UserBookDto(
                ub.Id,
                ub.BookId,
                ub.Book.Title,
                ub.Book.CoverImageUrl,
                ub.Book.Authors
                    .Select(a => new AuthorDto(a.Id, a.FirstName + " " + a.LastName))
                    .ToList(),
                ub.Status,
                ub.AddedAt,
                ub.Rating))
            .ToListAsync(ct);

    public async Task<UserBookDto> AddAsync(
        Guid userId, Guid bookId, ReadingStatus status, CancellationToken ct = default)
    {
        var userBook = new UserBook
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            BookId = bookId,
            Status = status,
            AddedAt = DateTime.UtcNow,
        };
        db.UserBooks.Add(userBook);
        await db.SaveChangesAsync(ct);

        return await db.UserBooks
            .AsNoTracking()
            .Where(ub => ub.Id == userBook.Id)
            .Select(ub => new UserBookDto(
                ub.Id,
                ub.BookId,
                ub.Book.Title,
                ub.Book.CoverImageUrl,
                ub.Book.Authors
                    .Select(a => new AuthorDto(a.Id, a.FirstName + " " + a.LastName))
                    .ToList(),
                ub.Status,
                ub.AddedAt,
                ub.Rating))
            .FirstAsync(ct);
    }

    public async Task<bool> RemoveAsync(Guid userId, Guid bookId, CancellationToken ct = default)
    {
        var entry = await db.UserBooks
            .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == bookId, ct);
        if (entry is null) return false;
        db.UserBooks.Remove(entry);
        await db.SaveChangesAsync(ct);
        return true;
    }

    public Task<bool> ExistsAsync(Guid userId, Guid bookId, CancellationToken ct = default)
        => db.UserBooks.AnyAsync(ub => ub.UserId == userId && ub.BookId == bookId, ct);

    public async Task<bool> UpdateStatusAsync(
        Guid userId, Guid bookId, ReadingStatus status, CancellationToken ct = default)
    {
        var entry = await db.UserBooks
            .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == bookId, ct);
        if (entry is null) return false;
        entry.Status = status;
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> RateAsync(Guid userId, Guid bookId, int rating, CancellationToken ct = default)
    {
        var entry = await db.UserBooks
            .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == bookId, ct);
        if (entry is null) return false;

        entry.Rating = Math.Clamp(rating, 1, 5);
        await db.SaveChangesAsync(ct);

        var avg = await db.UserBooks
            .Where(ub => ub.BookId == bookId && ub.Rating.HasValue)
            .AverageAsync(ub => (double)ub.Rating!.Value, ct);

        var book = await db.Books.FindAsync([bookId], ct);
        if (book is not null)
        {
            book.AverageRating = avg;
            await db.SaveChangesAsync(ct);
        }

        return true;
    }
}
