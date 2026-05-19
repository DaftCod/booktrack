using BookTrack.Application.UserBooks.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.UserBooks.Commands.AddUserBook;

public sealed class AddUserBookCommandHandler(IUserBookRepository repository)
    : IRequestHandler<AddUserBookCommand, ErrorOr<UserBookDto>>
{
    public async Task<ErrorOr<UserBookDto>> Handle(AddUserBookCommand request, CancellationToken ct)
    {
        var exists = await repository.ExistsAsync(request.UserId, request.BookId, ct);
        if (exists)
            return Error.Conflict("UserBook.AlreadyExists", "This book is already in your library.");

        var userBook = await repository.AddAsync(request.UserId, request.BookId, request.Status, ct);
        return userBook;
    }
}
