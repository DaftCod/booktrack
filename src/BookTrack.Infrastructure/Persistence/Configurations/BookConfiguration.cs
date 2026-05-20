using BookTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookTrack.Infrastructure.Persistence.Configurations;

internal sealed class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Title).HasMaxLength(500).IsRequired();
        builder.Property(b => b.Isbn).HasMaxLength(20);
        builder.Property(b => b.Description).HasMaxLength(4000);
        builder.Property(b => b.CoverImageUrl).HasMaxLength(500);
        builder.Property(b => b.AverageRating).HasDefaultValue(0.0);

        builder.HasMany(b => b.Authors)
            .WithMany(a => a.Books)
            .UsingEntity<Dictionary<string, object>>(
                "BookAuthor",
                j => j.HasOne<Author>().WithMany().HasForeignKey("AuthorId").OnDelete(DeleteBehavior.Cascade),
                j => j.HasOne<Book>().WithMany().HasForeignKey("BookId").OnDelete(DeleteBehavior.Cascade),
                j =>
                {
                    j.HasKey("BookId", "AuthorId");
                    j.HasData(
                        new { BookId = SeedIds.B01, AuthorId = SeedIds.A01 },
                        new { BookId = SeedIds.B02, AuthorId = SeedIds.A02 },
                        new { BookId = SeedIds.B03, AuthorId = SeedIds.A03 },
                        new { BookId = SeedIds.B04, AuthorId = SeedIds.A04 },
                        new { BookId = SeedIds.B05, AuthorId = SeedIds.A05 },
                        new { BookId = SeedIds.B06, AuthorId = SeedIds.A06 },
                        new { BookId = SeedIds.B07, AuthorId = SeedIds.A07 },
                        new { BookId = SeedIds.B08, AuthorId = SeedIds.A08 },
                        new { BookId = SeedIds.B09, AuthorId = SeedIds.A09 },
                        new { BookId = SeedIds.B10, AuthorId = SeedIds.A10 }
                    );
                });

        builder.HasMany(b => b.Genres)
            .WithMany(g => g.Books)
            .UsingEntity<Dictionary<string, object>>(
                "BookGenre",
                j => j.HasOne<Genre>().WithMany().HasForeignKey("GenreId").OnDelete(DeleteBehavior.Cascade),
                j => j.HasOne<Book>().WithMany().HasForeignKey("BookId").OnDelete(DeleteBehavior.Cascade),
                j =>
                {
                    j.HasKey("BookId", "GenreId");
                    j.HasData(
                        // The Name of the Wind → Fantasy
                        new { BookId = SeedIds.B01, GenreId = SeedIds.G01 },
                        // Project Hail Mary → Science Fiction
                        new { BookId = SeedIds.B02, GenreId = SeedIds.G02 },
                        // The House in the Cerulean Sea → Fantasy, Cozy Fantasy, Romance
                        new { BookId = SeedIds.B03, GenreId = SeedIds.G01 },
                        new { BookId = SeedIds.B03, GenreId = SeedIds.G06 },
                        new { BookId = SeedIds.B03, GenreId = SeedIds.G03 },
                        // Fourth Wing → Fantasy, Romance
                        new { BookId = SeedIds.B04, GenreId = SeedIds.G01 },
                        new { BookId = SeedIds.B04, GenreId = SeedIds.G03 },
                        // Lessons in Chemistry → Historical Fiction, Literary Fiction
                        new { BookId = SeedIds.B05, GenreId = SeedIds.G04 },
                        new { BookId = SeedIds.B05, GenreId = SeedIds.G08 },
                        // The Hitchhiker's Guide → Science Fiction, Comedy
                        new { BookId = SeedIds.B06, GenreId = SeedIds.G02 },
                        new { BookId = SeedIds.B06, GenreId = SeedIds.G07 },
                        // Pride and Prejudice → Classic, Romance
                        new { BookId = SeedIds.B07, GenreId = SeedIds.G05 },
                        new { BookId = SeedIds.B07, GenreId = SeedIds.G03 },
                        // The Midnight Library → Literary Fiction, Fantasy
                        new { BookId = SeedIds.B08, GenreId = SeedIds.G08 },
                        new { BookId = SeedIds.B08, GenreId = SeedIds.G01 },
                        // A Court of Thorns and Roses → Fantasy, Romance
                        new { BookId = SeedIds.B09, GenreId = SeedIds.G01 },
                        new { BookId = SeedIds.B09, GenreId = SeedIds.G03 },
                        // The Seven Husbands of Evelyn Hugo → Historical Fiction, Romance, Literary Fiction
                        new { BookId = SeedIds.B10, GenreId = SeedIds.G04 },
                        new { BookId = SeedIds.B10, GenreId = SeedIds.G03 },
                        new { BookId = SeedIds.B10, GenreId = SeedIds.G08 }
                    );
                });

        builder.HasData(
            new Book
            {
                Id = SeedIds.B01,
                Title = "The Name of the Wind",
                Isbn = "9780756404741",
                PublishedYear = 2007,
                PageCount = 662,
                AverageRating = 4.55,
                CoverImageUrl = "https://covers.openlibrary.org/b/isbn/9780756404741-L.jpg",
                Description = "A young man grows to be the most notorious wizard his world has ever seen, told in his own words."
            },
            new Book
            {
                Id = SeedIds.B02,
                Title = "Project Hail Mary",
                Isbn = "9780593135204",
                PublishedYear = 2021,
                PageCount = 476,
                AverageRating = 4.52,
                CoverImageUrl = "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg",
                Description = "A lone astronaut must save the Earth from disaster in this propulsive science-fiction adventure."
            },
            new Book
            {
                Id = SeedIds.B03,
                Title = "The House in the Cerulean Sea",
                Isbn = "9781250217288",
                PublishedYear = 2020,
                PageCount = 394,
                AverageRating = 4.26,
                CoverImageUrl = "https://covers.openlibrary.org/b/isbn/9781250217288-L.jpg",
                Description = "A magical story about love, family, and what makes a person good or evil."
            },
            new Book
            {
                Id = SeedIds.B04,
                Title = "Fourth Wing",
                Isbn = "9781649374042",
                PublishedYear = 2023,
                PageCount = 517,
                AverageRating = 4.17,
                CoverImageUrl = "https://covers.openlibrary.org/b/isbn/9781649374042-L.jpg",
                Description = "In a world where dragons choose their riders, one girl must survive the most dangerous year of her life."
            },
            new Book
            {
                Id = SeedIds.B05,
                Title = "Lessons in Chemistry",
                Isbn = "9780385547345",
                PublishedYear = 2022,
                PageCount = 390,
                AverageRating = 4.06,
                CoverImageUrl = "https://covers.openlibrary.org/b/isbn/9780385547345-L.jpg",
                Description = "A female scientist becomes America's most beloved cooking show host in 1960s California."
            },
            new Book
            {
                Id = SeedIds.B06,
                Title = "The Hitchhiker's Guide to the Galaxy",
                Isbn = "9780345391803",
                PublishedYear = 1979,
                PageCount = 193,
                AverageRating = 4.22,
                CoverImageUrl = "https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg",
                Description = "Seconds before the Earth is demolished for a bypass, Arthur Dent is swept into a madcap tour of the universe."
            },
            new Book
            {
                Id = SeedIds.B07,
                Title = "Pride and Prejudice",
                Isbn = "9780141439518",
                PublishedYear = 1813,
                PageCount = 432,
                AverageRating = 4.28,
                CoverImageUrl = "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
                Description = "The beloved story of Elizabeth Bennet and the proud Mr. Darcy in Regency England."
            },
            new Book
            {
                Id = SeedIds.B08,
                Title = "The Midnight Library",
                Isbn = "9780525559474",
                PublishedYear = 2020,
                PageCount = 304,
                AverageRating = 3.99,
                CoverImageUrl = "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg",
                Description = "Between life and death lies the Midnight Library — a place to try all the lives you could have lived."
            },
            new Book
            {
                Id = SeedIds.B09,
                Title = "A Court of Thorns and Roses",
                Isbn = "9781635575569",
                PublishedYear = 2015,
                PageCount = 419,
                AverageRating = 4.15,
                CoverImageUrl = "https://covers.openlibrary.org/b/isbn/9781635575569-L.jpg",
                Description = "A young mortal girl is whisked away to a magical land where the stakes are much higher than she imagined."
            },
            new Book
            {
                Id = SeedIds.B10,
                Title = "The Seven Husbands of Evelyn Hugo",
                Isbn = "9781501161933",
                PublishedYear = 2017,
                PageCount = 389,
                AverageRating = 4.42,
                CoverImageUrl = "https://covers.openlibrary.org/b/isbn/9781501161933-L.jpg",
                Description = "Reclusive Hollywood legend Evelyn Hugo finally reveals the truth about her glamorous and scandalous life."
            }
        );
    }
}
