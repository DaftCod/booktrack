using BookTrack.Application.UserBooks.Common;
using BookTrack.Domain.Enums;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.UserBooks.Commands.AddUserBook;

public sealed record AddUserBookCommand(Guid UserId, Guid BookId, ReadingStatus Status)
    : IRequest<ErrorOr<UserBookDto>>;
