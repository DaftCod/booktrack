using ErrorOr;
using MediatR;

namespace BookTrack.Application.Books.Commands.RemoveBook;

public sealed record RemoveBookCommand(Guid Id) : IRequest<ErrorOr<Deleted>>;
