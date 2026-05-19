using BookTrack.Domain.Entities;
using BookTrack.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookTrack.Infrastructure.Persistence.Configurations;

internal sealed class GenreConfiguration : IEntityTypeConfiguration<Genre>
{
    public void Configure(EntityTypeBuilder<Genre> builder)
    {
        builder.HasKey(g => g.Id);
        builder.Property(g => g.Name).HasMaxLength(100).IsRequired();
        builder.HasIndex(g => g.Name).IsUnique();

        builder.HasData(
            new Genre { Id = SeedIds.G01, Name = "Fantasy" },
            new Genre { Id = SeedIds.G02, Name = "Science Fiction" },
            new Genre { Id = SeedIds.G03, Name = "Romance" },
            new Genre { Id = SeedIds.G04, Name = "Historical Fiction" },
            new Genre { Id = SeedIds.G05, Name = "Classic" },
            new Genre { Id = SeedIds.G06, Name = "Cozy Fantasy" },
            new Genre { Id = SeedIds.G07, Name = "Comedy" },
            new Genre { Id = SeedIds.G08, Name = "Literary Fiction" }
        );
    }
}
