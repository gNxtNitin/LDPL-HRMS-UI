using System.Text;
using System.Text.Json;
using System.Xml;
using UserManagementService.DTOs.RequestModels;
using UserManagementService.DTOs.ResponseModels;
using UserManagementService.IRepository;
using UserManagementService.Models;
using UserManagementService.Utility;
using UserManagementService.Utility.APIHelper;

namespace UserManagementService.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly AuthOptions _authOptions;
        private readonly IApiClientHelper _apiClientHelper;
        IMemoryCacheService _memoryCacheService;

        public AccountRepository(AuthOptions authOptions, IApiClientHelper apiClientHelper, IMemoryCacheService memoryCacheService = null)
        {
            _authOptions = authOptions;
            _apiClientHelper = apiClientHelper;
            _memoryCacheService = memoryCacheService;
        }

        public async Task<bool> IsOTPRequestValid(string uid)
        {
            string val = _memoryCacheService.Get(uid);

            return string.IsNullOrEmpty(val) ? false : true;
        }

        public async Task<LoginStatus> LoginAdmin(LoginRequest loginRequestModel)
        {


            APIResponse respBody = await _apiClientHelper.PostAsync<LoginRequest, APIResponse>("/api/Auth/AuthenticateAdmin", loginRequestModel);

            if (respBody.Code > 0)
            {

                string token;
                string userId;
                string empId;
                string role;
                string uname;

                using (JsonDocument doc = JsonDocument.Parse(respBody.Data.ToString()))
                {
                    token = doc.RootElement.GetProperty("token").GetString();
                    userId = doc.RootElement.GetProperty("userId").GetString();
                    empId = doc.RootElement.GetProperty("empId").GetString();
                    role = doc.RootElement.GetProperty("role").GetString();
                    uname = doc.RootElement.GetProperty("name").GetString();
                }


                return new LoginStatus
                {
                    //CompanyName = companyName,
                    EmpId = empId,
                    Role = role,
                    UserName = uname,
                    Success = true,
                    IsOtpRequired = false,
                    UserId = userId,
                    Token = token,
                    PasswordState = respBody.Code == 202 ? PasswordStatus.AboutToExpire : PasswordStatus.Valid,
                    Message = respBody.Code == 202 ? respBody.Msg : string.Empty
                };


            }

            return new LoginStatus { Success = false, IsOtpRequired = _authOptions.OTPRequired };
        }


        public async Task<LoginStatus> LoginUser(LoginRequest loginRequestModel)
        {
           

            APIResponse respBody = await _apiClientHelper.PostAsync<LoginRequest, APIResponse>("/api/Auth/AuthenticateUser", loginRequestModel);

            if (respBody.Code > 0)
            {

                string token;
                string userId;
                string companyName;
                string uname;
                string role;

                using (JsonDocument doc = JsonDocument.Parse(respBody.Data.ToString()))
                {
                    token = doc.RootElement.GetProperty("token").GetString();
                    userId = doc.RootElement.GetProperty("userId").GetString();
                    companyName = doc.RootElement.GetProperty("companyname").GetString();
                    uname = doc.RootElement.GetProperty("name").GetString();
                    role = doc.RootElement.GetProperty("role").GetString();
                }


                return new LoginStatus
                {
                    CompanyName = companyName,
                    UserName = uname,
                    Role = role,
                    Success = true,
                    IsOtpRequired = false,
                    UserId = userId,
                    Token = token,
                    PasswordState = respBody.Code == 202 ? PasswordStatus.AboutToExpire : PasswordStatus.Valid,
                    Message = respBody.Code == 202 ? respBody.Msg : string.Empty
                };

                
            }

            return new LoginStatus { Success = false, IsOtpRequired = _authOptions.OTPRequired };
        }



        public async Task<string> RegisterUser(AddUpdateUserRequest userRequestModel)
        {

            APIResponse respBody = await _apiClientHelper.PostAsync<AddUpdateUserRequest, APIResponse>("/api/Account/CreateUser", userRequestModel);

            if (respBody.Code > 0)
            {
                var uniqueId = Guid.NewGuid().ToString();
                _memoryCacheService.Set(uniqueId, userRequestModel.Email, TimeSpan.FromMinutes(10));

                return uniqueId;
            }

            return string.Empty;
        }

        public async Task<OTPSentStatus> ResendOTP(string uniqueId)
        {

            string userEmailOrPhone = _memoryCacheService.Get(uniqueId);

            if (string.IsNullOrEmpty(userEmailOrPhone))
            {
                return new OTPSentStatus { IsSent = false, IsRequestValid = false, RetryLimitReached = false };
            }


            LoginRequest loginRequest = new LoginRequest()
            {
                UserId = string.Empty,
                MobileOrEmail = userEmailOrPhone,
                IsJwtToken = false,
                IsLoginWithOtp = false,
                IsResendCode = 1,
                Password = string.Empty,
                VerificationCode = string.Empty
            };

            APIResponse respBody = await _apiClientHelper.PostAsync<LoginRequest, APIResponse>("/api/Auth/AuthenticateUser", loginRequest);

            return respBody.Code > 0 ? new OTPSentStatus { IsSent = true, RetryLimitReached = false, IsRequestValid = true } : new OTPSentStatus { IsSent = false, RetryLimitReached = false, IsRequestValid = true };
        }

        public async Task<OTPValidateStatus> ValidateOTP(string uniqueId, string otp, bool isToken = false)
        {
            string emailOrPhone = _memoryCacheService.Get(uniqueId);

            if (string.IsNullOrEmpty(emailOrPhone))
            {
                return new OTPValidateStatus { IsRequestValid = false, IsValidated = false, IsToken = isToken };
            }

            LoginRequest loginRequestModel = new LoginRequest()
            {
                MobileOrEmail = emailOrPhone,
                VerificationCode = otp,
                UserId = string.Empty,
                Password = string.Empty,
                IsResendCode = 0,
                IsJwtToken = isToken
            };

            APIResponse respBody = await _apiClientHelper.PostAsync<LoginRequest, APIResponse>("/api/Auth/ValidateOTP", loginRequestModel);


            if (isToken && respBody != null && respBody.Data != null)
            {
                _memoryCacheService.Remove(uniqueId);
                return new OTPValidateStatus() { Token = respBody.Data.ToString(), IsToken = isToken, IsValidated = true, IsRequestValid = true };
            }

            OTPValidateStatus status = new OTPValidateStatus();
            if (respBody.Code > 0)
            {
                _memoryCacheService.Remove(uniqueId);
                status.IsRequestValid = true;
                status.IsValidated = true;
                status.IsToken = isToken;
            }

            return status;
        }

        public async Task<(bool, string)> ResetPasswordUrlValidate(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return (false, string.Empty);
            }

            bool isUrlValid = false;
            string decoded = EncDecHelper.Decrypt(token);
            string[] encCodes = decoded.Split('&');
            string userId = string.Empty;

            if (encCodes.Length == 2)
            {
                string tokenhash = encCodes[0];

                APIResponse respBody = await _apiClientHelper.PostAsync<string, APIResponse>("/api/PasswordManagement/ValidateResetPasswordToken", tokenhash);
                if (respBody.Code > 0)
                {
                    isUrlValid = true;
                    userId = encCodes[1];
                }
            }

            return (isUrlValid, userId);


        }

        //public async Task<(bool, string)> ResetPasswordUrlValidate(string code)
        //{
        //    bool isUrlValid = false;
        //    string decoded = EncDecHelper.Decrypt(code);
        //    string[] encCodes = decoded.Split('&');
        //    string email = string.Empty;

        //    if (encCodes.Length == 2)
        //    {
        //        email = encCodes[0];
        //        string otp = encCodes[1];

        //        LoginRequest loginRequestModel = new LoginRequest()
        //        {
        //            MobileOrEmail = email,
        //            VerificationCode = otp,
        //            UserId = string.Empty,
        //            Password = string.Empty,
        //            IsResendCode = 0,
        //            IsJwtToken = false,
        //            IsLoginWithOtp = true

        //        };

        //        APIResponse respBody = await _apiClientHelper.PostAsync<LoginRequest, APIResponse>("/api/Auth/ValidateOTP", loginRequestModel);

        //        if (respBody.Code > 0)
        //        {
        //            isUrlValid = true;
        //        }

        //    }

        //    return (isUrlValid, email);
        //}

        public async Task<bool> ResetPassword(string userId, string password)
        {
            bool isResetSuccessfull = false;
            LoginRequest loginRequestModel = new LoginRequest()
            {
                MobileOrEmail = string.Empty,
                Password = password,
                IsJwtToken = false,
                IsLoginWithOtp = false,
                IsResendCode = 0,
                UserId = userId,
                VerificationCode = string.Empty
            };

            APIResponse respBody = await _apiClientHelper.PostAsync<LoginRequest, APIResponse>("api/PasswordManagement/ResetPassword", loginRequestModel);

            if (respBody.Code > 0)
            {
                isResetSuccessfull = true;
            }

            return isResetSuccessfull;
        }

        public async Task<bool> SendForgotPasswordEmail(string email)
        {
            LoginRequest loginRequestModel = new LoginRequest
            {
                MobileOrEmail = email,
                IsJwtToken = false,
                IsLoginWithOtp = false,
                IsResendCode = 0,
                Password = string.Empty,
                UserId = string.Empty,
                VerificationCode = string.Empty
            };

            APIResponse respBody = await _apiClientHelper.PostAsync<LoginRequest, APIResponse>("/api/PasswordManagement/ForgotPassword", loginRequestModel);

            if (respBody.Code > 0)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> UpdatePassword(string userId, string password)
        {
            APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>($"/api/Account/GetUser?userId={userId}");
            bool isResetSuccessfull = false;


            if (resp.Code > 0)
            {
                var jsonData = JsonSerializer.Deserialize<JsonElement>(resp.Data.ToString());

                if (jsonData.TryGetProperty("Users", out var usersJson) && usersJson.GetArrayLength() > 0)
                {
                    var userInfo = JsonSerializer.Deserialize<AddUpdateUserRequest>(usersJson[0].GetRawText());

                    LoginRequest pwUpdateReq = new LoginRequest()
                    {
                        MobileOrEmail = userInfo.Email,
                        Password = password,
                        IsJwtToken = false,
                        IsLoginWithOtp = false,
                        IsResendCode = 0,
                        UserId = string.Empty,
                        VerificationCode = string.Empty
                    };



                    APIResponse respBody = await _apiClientHelper.PostAsync<LoginRequest, APIResponse>("api/PasswordManagement/ResetPassword", pwUpdateReq);

                    if (respBody.Code > 0)
                    {
                        isResetSuccessfull = true;
                    }


                }
            }

            return isResetSuccessfull;
        }

        public async Task<string> GetRoleByUserId(string userId)
        {
            var roleReqModel = new AssignRoleReqModel() { RoleId = string.Empty, UserId = userId };

            var apiResp = await _apiClientHelper.PostAsync<AssignRoleReqModel, APIResponse>("/api/RolesManagement/GetRoleByUserId", roleReqModel);

            if (apiResp.Code > 0)
            {
                var jsonData = JsonSerializer.Deserialize<JsonElement>(apiResp.Data.ToString());

                if (jsonData.TryGetProperty("Roles", out var rolesJson) && rolesJson.GetArrayLength() > 0)
                {
                    RoleMasterReqModel userRoles = JsonSerializer.Deserialize<RoleMasterReqModel>(rolesJson[0].GetRawText());

                    return userRoles.RoleName;
                }


            }

            return string.Empty;
        }
        public async Task<PasswordPolicyValidatonRule> GetPasswordValRules()
        {
            PasswordPolicyValidatonRule passwordPolicy = null;

            APIResponse apiResp = await _apiClientHelper.GetAsync<APIResponse>($"/api/PasswordManagement/GetPasswordValidationRules");

            if (apiResp.Code > 0)
            {
                var jsonData = JsonSerializer.Deserialize<JsonElement>(apiResp.Data.ToString());

                if (jsonData.TryGetProperty("Table", out var dataJson) && dataJson.GetArrayLength() > 0)
                {
                    passwordPolicy = JsonSerializer.Deserialize<PasswordPolicyValidatonRule>(dataJson[0].GetRawText());
                }
            }

            return passwordPolicy;
        }

        
    }
}
