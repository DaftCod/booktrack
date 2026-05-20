using BookTrack.Application.Books.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.Books.Queries.GetBookById;

public sealed record GetBookByIdQuery(Guid Id) : IRequest<ErrorOr<BookDto>>;
