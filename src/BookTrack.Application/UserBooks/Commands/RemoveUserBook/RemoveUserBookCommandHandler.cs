using BookTrack.Application.UserBooks.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.UserBooks.Commands.RemoveUserBook;

public sealed class RemoveUserBookCommandHandler(IUserBookRepository repository)
    : IRequestHandler<RemoveUserBookCommand, ErrorOr<Deleted>>
{
    public async Task<ErrorOr<Deleted>> Handle(RemoveUserBookCommand request, CancellationToken ct)
    {
        var removed = await repository.RemoveAsync(request.UserId, request.BookId, ct);
        return removed
            ? Result.Deleted
            : Error.NotFound("UserBook.NotFound", "This book is not in your library.");
    }
}
