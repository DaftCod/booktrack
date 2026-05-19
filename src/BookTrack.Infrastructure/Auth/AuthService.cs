using BookTrack.Application.Auth.Common;
using BookTrack.Infrastructure.Identity;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace BookTrack.Infrastructure.Auth;

internal sealed class AuthService(
    UserManager<AppUser> userManager,
    ITokenService tokenService) : IAuthService
{
    public async Task<AuthResultDto?> LoginAsync(string username, string password, CancellationToken ct = default)
    {
        var user = await userManager.FindByNameAsync(username);
        if (user is null || !await userManager.CheckPasswordAsync(user, password))
            return null;

        var roles = await userManager.GetRolesAsync(user);
        var role = roles.Contains("Admin") ? "Admin" : "Guest";
        var token = tokenService.CreateToken(user.Id, user.UserName!, role);
        return new AuthResultDto(token, user.Id, user.UserName!, role);
    }

    public async Task<ErrorOr<AuthResultDto>> RegisterGuestAsync(string username, string password, CancellationToken ct = default)
    {
        var user = new AppUser { UserName = username, Email = $"{username}@booktrack.dev" };
        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            List<Error> errors = result.Errors
                .Select(e => Error.Validation(e.Code, e.Description))
                .ToList();
            return errors;
        }

        await userManager.AddToRoleAsync(user, "Guest");
        var token = tokenService.CreateToken(user.Id, username, "Guest");
        return new AuthResultDto(token, user.Id, username, "Guest");
    }
}
