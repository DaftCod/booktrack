using BookTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookTrack.Infrastructure.Persistence.Configurations;

internal sealed class AuthorConfiguration : IEntityTypeConfiguration<Author>
{
    public void Configure(EntityTypeBuilder<Author> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.FirstName).HasMaxLength(200).IsRequired();
        builder.Property(a => a.LastName).HasMaxLength(200).IsRequired();
        builder.Property(a => a.Bio).HasMaxLength(2000);
        builder.Ignore(a => a.FullName);

        builder.HasData(
            new Author { Id = SeedIds.A01, FirstName = "Patrick",  LastName = "Rothfuss",      Bio = "American author of epic fantasy." },
            new Author { Id = SeedIds.A02, FirstName = "Andy",     LastName = "Weir",          Bio = "American author known for hard science fiction." },
            new Author { Id = SeedIds.A03, FirstName = "TJ",       LastName = "Klune",         Bio = "New York Times bestselling author of cozy fantasy." },
            new Author { Id = SeedIds.A04, FirstName = "Rebecca",  LastName = "Yarros",        Bio = "USA Today and Wall Street Journal bestselling author." },
            new Author { Id = SeedIds.A05, FirstName = "Bonnie",   LastName = "Garmus",        Bio = "American author and creative director." },
            new Author { Id = SeedIds.A06, FirstName = "Douglas",  LastName = "Adams",         Bio = "English author, screenwriter, and humorist." },
            new Author { Id = SeedIds.A07, FirstName = "Jane",     LastName = "Austen",        Bio = "English novelist known for her romantic fiction." },
            new Author { Id = SeedIds.A08, FirstName = "Matt",     LastName = "Haig",          Bio = "British author for children and adults." },
            new Author { Id = SeedIds.A09, FirstName = "Sarah J.", LastName = "Maas",          Bio = "New York Times and internationally bestselling author." },
            new Author { Id = SeedIds.A10, FirstName = "Taylor Jenkins", LastName = "Reid",    Bio = "American author of contemporary fiction." }
        );
    }
}
