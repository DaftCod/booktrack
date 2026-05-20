using BookTrack.Domain.Enums;

namespace BookTrack.Application.UserBooks.Common;

public interface IUserBookRepository
{
    Task<List<UserBookDto>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<UserBookDto> AddAsync(Guid userId, Guid bookId, ReadingStatus status, CancellationToken ct = default);
    Task<bool> RemoveAsync(Guid userId, Guid bookId, CancellationToken ct = default);
    Task<bool> ExistsAsync(Guid userId, Guid bookId, CancellationToken ct = default);
    Task<bool> UpdateStatusAsync(Guid userId, Guid bookId, ReadingStatus status, CancellationToken ct = default);
    Task<bool> RateAsync(Guid userId, Guid bookId, int rating, CancellationToken ct = default);
}
