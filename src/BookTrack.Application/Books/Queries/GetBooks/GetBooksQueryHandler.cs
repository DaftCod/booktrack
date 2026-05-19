using BookTrack.Application.Books.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.Books.Queries.GetBooks;

public sealed class GetBooksQueryHandler(IBookRepository repository)
    : IRequestHandler<GetBooksQuery, ErrorOr<List<BookDto>>>
{
    public async Task<ErrorOr<List<BookDto>>> Handle(
        GetBooksQuery request,
        CancellationToken cancellationToken)
    {
        var books = await repository.GetAllBooksAsync(cancellationToken);
        return books;
    }
}
