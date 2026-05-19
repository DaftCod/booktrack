namespace BookTrack.Domain.Entities;

public sealed class Book
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Isbn { get; set; }
    public int? PublishedYear { get; set; }
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public int? PageCount { get; set; }
    public double AverageRating { get; set; }
    public ICollection<Author> Authors { get; set; } = [];
    public ICollection<Genre> Genres { get; set; } = [];
}
