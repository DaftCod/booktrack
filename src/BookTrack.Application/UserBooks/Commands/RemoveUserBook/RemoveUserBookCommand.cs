using ErrorOr;
using MediatR;

namespace BookTrack.Application.UserBooks.Commands.RemoveUserBook;

public sealed record RemoveUserBookCommand(Guid UserId, Guid BookId)
    : IRequest<ErrorOr<Deleted>>;
