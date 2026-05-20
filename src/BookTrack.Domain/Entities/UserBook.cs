using BookTrack.Domain.Enums;

namespace BookTrack.Domain.Entities;

public sealed class UserBook
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
    public ReadingStatus Status { get; set; }
    public int? Rating { get; set; }
    public DateTime AddedAt { get; set; }
    public Book Book { get; set; } = null!;
}
