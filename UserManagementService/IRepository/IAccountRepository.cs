using UserManagementService.DTOs.RequestModels;
using UserManagementService.DTOs.ResponseModels;
using UserManagementService.Models;

namespace UserManagementService.IRepository
{
    public interface IAccountRepository
    {
        Task<string> RegisterUser(AddUpdateUserRequest userRequestModel);

        Task<LoginStatus> LoginUser(LoginRequest loginRequestModel); 
        //Task<LoginStatus> LoginAdmin(LoginRequest loginRequestModel);
       
        Task<OTPValidateStatus> ValidateOTP(string uid, string otp, bool isToken = false);

        Task<OTPSentStatus> ResendOTP(string uniqueId);

        Task<bool> IsOTPRequestValid(string uid);

        Task<EmailStatus> SendForgotPasswordEmail(string email);
        Task<(bool, string)> ResetPasswordUrlValidate(string code);

        Task<bool> ResetPassword(string email, string password);

        Task<bool> UpdatePassword(string userId, string password);

        Task<string> GetRoleByUserId(string userId);

        Task<PasswordPolicyValidatonRule> GetPasswordValRules();


    }
}
