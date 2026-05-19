namespace BookTrack.Domain.Entities;

public sealed class Genre
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<Book> Books { get; set; } = [];
}
