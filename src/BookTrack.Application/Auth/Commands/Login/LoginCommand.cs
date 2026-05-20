using BookTrack.Application.Auth.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.Auth.Commands.Login;

public sealed record LoginCommand(string Username, string Password)
    : IRequest<ErrorOr<AuthResultDto>>;
