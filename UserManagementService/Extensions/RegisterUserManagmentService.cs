using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using UserManagementService.IRepository;
using UserManagementService.Models;
using UserManagementService.Repository;
using UserManagementService.Utility;
using UserManagementService.Utility.APIHelper;

namespace UserManagementService.Extensions
{
    public static class RegisterUserManagmentService
    {
       
        public static IServiceCollection AddUserManagementServices(this IServiceCollection services, IConfiguration configuration)
        {
            AuthOptions authOptions = configuration.GetSection("LoginOptions").Get<AuthOptions>();
            string baseUrl = configuration.GetValue<string>("APIBaseUrl");


            if (authOptions == null ) throw new ArgumentNullException("LoginOptions Not Found in appsettings.json file");
            if (baseUrl == null ) throw new ArgumentNullException("APIBaseUrl Not Found in appsettings.json file");

            
           
         
            services.AddScoped<IMemoryCacheService, MemoryCacheService>();

            services.AddTransient<SessionTokenHandler>();

            services.AddHttpClient<IApiClientHelper, ApiClientHelper>((client) =>
            {
                client.BaseAddress = new Uri(baseUrl);
               
            }).AddHttpMessageHandler<SessionTokenHandler>(); ;

            services.AddScoped<IAccountRepository, AccountRepository>((serviceProvider) =>
            {
                var memoryCacheService = serviceProvider.GetRequiredService<IMemoryCacheService>();
                var apiClientHelper = serviceProvider.GetRequiredService<IApiClientHelper>();

                return new AccountRepository(authOptions, apiClientHelper, memoryCacheService);
            });

           

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IMenuRepository, MenuRepository>();
            services.AddScoped<IAdminRepository, AdminRepository>();
            services.AddScoped<IConfigurationRepository, ConfigurationRepository>();
            services.AddScoped<ISecureCaptchaService, SecureCaptchaService>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IAdminPortalRepository, AdminPortalRepository>();
            services.AddScoped<IReportRepository, ReportRepository>();
            services.AddScoped<ILeaveRepository, LeaveRepository>();

            return services; // Return the IServiceCollection for method chaining

            // TODO -- 
            // register httpclient in a helper class for all api requests -- use that helper class for
            // all api calls in all repositories,
           
            


        }

    

    }
}
