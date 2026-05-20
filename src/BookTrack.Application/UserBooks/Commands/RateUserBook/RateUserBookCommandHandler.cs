using BookTrack.Application.UserBooks.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.UserBooks.Commands.RateUserBook;

public sealed class RateUserBookCommandHandler(IUserBookRepository repository)
    : IRequestHandler<RateUserBookCommand, ErrorOr<Success>>
{
    public async Task<ErrorOr<Success>> Handle(RateUserBookCommand request, CancellationToken ct)
    {
        if (request.Rating is < 1 or > 5)
            return Error.Validation("Rating.Range", "Rating must be between 1 and 5.");

        var success = await repository.RateAsync(request.UserId, request.BookId, request.Rating, ct);
        return success ? Result.Success : Error.NotFound("UserBook.NotFound", "Book not in user's library.");
    }
}
