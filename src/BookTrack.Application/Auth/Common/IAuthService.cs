using ErrorOr;

namespace BookTrack.Application.Auth.Common;

public record AuthResultDto(string Token, Guid UserId, string Username, string Role);

public interface IAuthService
{
    Task<AuthResultDto?> LoginAsync(string username, string password, CancellationToken ct = default);
    Task<ErrorOr<AuthResultDto>> RegisterGuestAsync(string username, string password, CancellationToken ct = default);
}
