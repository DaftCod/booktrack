using BookTrack.Application.Books.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.Books.Queries.GetBookById;

public sealed class GetBookByIdQueryHandler(IBookRepository repository)
    : IRequestHandler<GetBookByIdQuery, ErrorOr<BookDto>>
{
    public async Task<ErrorOr<BookDto>> Handle(
        GetBookByIdQuery request,
        CancellationToken cancellationToken)
    {
        var book = await repository.GetBookByIdAsync(request.Id, cancellationToken);
        return book is null
            ? Error.NotFound("Book.NotFound", $"Book with ID {request.Id} was not found.")
            : book;
    }
}
