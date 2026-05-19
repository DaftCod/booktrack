using BookTrack.Application.Books.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.Books.Commands.AddBook;

public sealed class AddBookCommandHandler(IBookRepository repository)
    : IRequestHandler<AddBookCommand, ErrorOr<BookDto>>
{
    public async Task<ErrorOr<BookDto>> Handle(AddBookCommand request, CancellationToken ct)
    {
        var book = await repository.AddBookAsync(
            request.Title,
            request.Isbn,
            request.PublishedYear,
            request.Description,
            request.CoverImageUrl,
            request.PageCount,
            request.AuthorNames,
            request.GenreNames,
            ct);
        return book;
    }
}
