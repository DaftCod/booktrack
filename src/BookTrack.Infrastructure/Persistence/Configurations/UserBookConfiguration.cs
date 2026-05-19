using BookTrack.Domain.Entities;
using BookTrack.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookTrack.Infrastructure.Persistence.Configurations;

internal sealed class UserBookConfiguration : IEntityTypeConfiguration<UserBook>
{
    public void Configure(EntityTypeBuilder<UserBook> builder)
    {
        builder.HasKey(ub => ub.Id);
        builder.Property(ub => ub.Status).IsRequired();
        builder.Property(ub => ub.AddedAt).IsRequired();

        builder.HasOne(ub => ub.Book)
            .WithMany()
            .HasForeignKey(ub => ub.BookId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(ub => ub.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(ub => new { ub.UserId, ub.BookId }).IsUnique();
    }
}
