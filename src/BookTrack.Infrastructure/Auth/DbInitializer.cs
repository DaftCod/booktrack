using BookTrack.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace BookTrack.Infrastructure.Auth;

public static class DbInitializer
{
    public static async Task SeedUsersAndRolesAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        foreach (var role in new[] { "Admin", "Guest" })
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }

        await EnsureUserAsync(userManager, "admin", "Admin123!", "Admin");
        await EnsureUserAsync(userManager, "guest", "Guest123!", "Guest");
    }

    private static async Task EnsureUserAsync(
        UserManager<AppUser> userManager, string username, string password, string role)
    {
        if (await userManager.FindByNameAsync(username) is not null)
            return;

        var user = new AppUser { UserName = username, Email = $"{username}@booktrack.dev" };
        var result = await userManager.CreateAsync(user, password);
        if (result.Succeeded)
            await userManager.AddToRoleAsync(user, role);
    }
}
