using BookTrack.Application.UserBooks.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.UserBooks.Queries.GetUserBooks;

public sealed record GetUserBooksQuery(Guid UserId) : IRequest<ErrorOr<List<UserBookDto>>>;
