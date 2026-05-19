using BookTrack.Application.UserBooks.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.UserBooks.Queries.GetUserBooks;

public sealed class GetUserBooksQueryHandler(IUserBookRepository repository)
    : IRequestHandler<GetUserBooksQuery, ErrorOr<List<UserBookDto>>>
{
    public async Task<ErrorOr<List<UserBookDto>>> Handle(GetUserBooksQuery request, CancellationToken ct)
    {
        var books = await repository.GetByUserIdAsync(request.UserId, ct);
        return books;
    }
}
