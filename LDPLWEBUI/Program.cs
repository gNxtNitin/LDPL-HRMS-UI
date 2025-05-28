using LDPLWEBUI.Middleware;
using UserManagementService.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddMemoryCache();

builder.Services.AddSession(options =>
{
    //options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    //options.Cookie.SameSite = SameSiteMode.Strict;
});

builder.Services.AddAuthentication("CookieAuth")
    .AddCookie("CookieAuth", options =>
    {
        options.LoginPath = "/";
        options.AccessDeniedPath = "/Auth/AccessDenied";
        //options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.None;
        //options.Cookie.SameSite = SameSiteMode.Strict;
        options.ExpireTimeSpan = TimeSpan.FromMinutes(30);

    });
builder.Services.AddHttpContextAccessor();



builder.Services.AddAuthorization();

builder.Services.AddUserManagementServices(builder.Configuration);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseSession();
app.UseCookiePolicy();
app.UseAuthentication();

app.UseAuthorization();
app.UseMiddleware<UnauthorizedAPIAccessMiddleware>();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Auth}/{action=Login}/{id?}");
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
