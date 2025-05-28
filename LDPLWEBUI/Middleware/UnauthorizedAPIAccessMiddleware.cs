using Microsoft.AspNetCore.Authentication;
using UserManagementService.Utility.APIHelper;

namespace LDPLWEBUI.Middleware
{
    public class UnauthorizedAPIAccessMiddleware
    {
        private readonly RequestDelegate _next;

        public UnauthorizedAPIAccessMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (UnauthorizedApiException)
            {

                context.Session.Clear();
                context.Response.Cookies.Delete("user_token");
                await context.SignOutAsync();

                context.Response.Cookies.Append("LogoutMessage", "Session expired. Please log in again.", new CookieOptions { HttpOnly = true, IsEssential = true, Secure = true });
                context.Response.Redirect("/Auth/Login");
            }
        }
    }
}
