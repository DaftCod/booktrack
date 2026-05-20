namespace BookTrack.Infrastructure.Auth;

internal interface ITokenService
{
    string CreateToken(Guid userId, string username, string role);
}
