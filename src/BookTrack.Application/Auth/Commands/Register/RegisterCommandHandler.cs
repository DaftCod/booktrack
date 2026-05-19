using BookTrack.Application.Auth.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.Auth.Commands.Register;

public sealed class RegisterCommandHandler(IAuthService authService)
    : IRequestHandler<RegisterCommand, ErrorOr<AuthResultDto>>
{
    public async Task<ErrorOr<AuthResultDto>> Handle(RegisterCommand request, CancellationToken ct)
        => await authService.RegisterGuestAsync(request.Username, request.Password, ct);
}
