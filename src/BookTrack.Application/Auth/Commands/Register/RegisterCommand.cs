using BookTrack.Application.Auth.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.Auth.Commands.Register;

public sealed record RegisterCommand(string Username, string Password)
    : IRequest<ErrorOr<AuthResultDto>>;
