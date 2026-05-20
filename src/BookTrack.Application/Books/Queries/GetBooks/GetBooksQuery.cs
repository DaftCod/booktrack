using BookTrack.Application.Books.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.Books.Queries.GetBooks;

public sealed record GetBooksQuery : IRequest<ErrorOr<List<BookDto>>>;
