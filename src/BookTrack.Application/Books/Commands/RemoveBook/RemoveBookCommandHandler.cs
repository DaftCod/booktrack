using BookTrack.Application.Books.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.Books.Commands.RemoveBook;

public sealed class RemoveBookCommandHandler(IBookRepository repository)
    : IRequestHandler<RemoveBookCommand, ErrorOr<Deleted>>
{
    public async Task<ErrorOr<Deleted>> Handle(RemoveBookCommand request, CancellationToken ct)
    {
        var removed = await repository.RemoveBookAsync(request.Id, ct);
        return removed
            ? Result.Deleted
            : Error.NotFound("Book.NotFound", $"Book with ID {request.Id} was not found.");
    }
}
