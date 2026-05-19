using FluentValidation;

namespace BookTrack.Application.Books.Commands.AddBook;

public sealed class AddBookCommandValidator : AbstractValidator<AddBookCommand>
{
    public AddBookCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Isbn).MaximumLength(20).When(x => x.Isbn is not null);
        RuleFor(x => x.PublishedYear)
            .InclusiveBetween(1, DateTime.UtcNow.Year + 5)
            .When(x => x.PublishedYear.HasValue);
        RuleFor(x => x.PageCount).GreaterThan(0).When(x => x.PageCount.HasValue);
        RuleFor(x => x.AuthorNames).NotEmpty().WithMessage("At least one author is required.");
    }
}
