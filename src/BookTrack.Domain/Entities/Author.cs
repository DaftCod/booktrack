namespace BookTrack.Domain.Entities;

public sealed class Author
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public ICollection<Book> Books { get; set; } = [];

    public string FullName => $"{FirstName} {LastName}";
}
