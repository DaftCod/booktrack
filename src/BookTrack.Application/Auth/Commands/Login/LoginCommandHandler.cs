using BookTrack.Application.Auth.Common;
using ErrorOr;
using MediatR;

namespace BookTrack.Application.Auth.Commands.Login;

public sealed class LoginCommandHandler(IAuthService authService)
    : IRequestHandler<LoginCommand, ErrorOr<AuthResultDto>>
{
    public async Task<ErrorOr<AuthResultDto>> Handle(LoginCommand request, CancellationToken ct)
    {
        var result = await authService.LoginAsync(request.Username, request.Password, ct);
        return result is null
            ? Error.Unauthorized("Auth.InvalidCredentials", "Invalid username or password.")
            : result;
    }
}
