using ErrorOr;
using MediatR;

namespace BookTrack.Application.UserBooks.Commands.RateUserBook;

public sealed record RateUserBookCommand(Guid UserId, Guid BookId, int Rating) : IRequest<ErrorOr<Success>>;
