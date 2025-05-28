
using Microsoft.AspNetCore.Http;
using System.Globalization;
using System.Text;
using System.Text.Json;
using UserManagementService.DTOs.RequestModels;
using UserManagementService.DTOs.ResponseModels;
using UserManagementService.IRepository;
using UserManagementService.Models;
using UserManagementService.Utility.APIHelper;

namespace UserManagementService.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly IApiClientHelper _apiClientHelper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserRepository(IApiClientHelper apiClientHelper, IHttpContextAccessor httpContextAccessor)
        {
            _apiClientHelper = apiClientHelper;
            _httpContextAccessor = httpContextAccessor;

            //string token = string.Empty;
            //byte[] tokenBytes = null;

            //bool hasToken = httpContextAccessor.HttpContext?.Session?.TryGetValue("user_token", out tokenBytes) ?? false;

            //if (hasToken && tokenBytes != null)
            //{
            //    token = Encoding.UTF8.GetString(tokenBytes);
            //    _apiClientHelper.SetAuthorizationHeader(token);
            //}

        }
        public async Task<List<SchoolRequestModel>> GetAllSchool(string empid)
        {
            Dictionary<string, string> q = new Dictionary<string, string>();
            q.Add("cid1", empid);
            //q.Add("cid2", companycode);
            try
            {

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/user/GetAllSchool", q);

                if (resp.Code == 1)
                {
                    List<SchoolRequestModel> list = JsonSerializer.Deserialize<List<SchoolRequestModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return list;
                }
            }
            catch (Exception ex)
            {

            }

            return new List<SchoolRequestModel>();
        }
        public async Task<bool> CreateUpdateDeleteSchool(SchoolRequestModel srm)
        {
            try
            {

                APIResponse respBody = await _apiClientHelper.PostAsync<SchoolRequestModel, APIResponse>("/api/user/CreateUpdateDeleteSchool", srm);

                if (respBody.Code > 0)
                {
                    //var uniqueId = Guid.NewGuid().ToString();
                    //_memoryCacheService.Set(uniqueId, userRequestModel.Email, TimeSpan.FromMinutes(10));

                    return true;
                }
            }
            catch (Exception ex)
            {

            }
            return false;
        }
        public async Task<AddUpdateUserRequest> GetUserProfile(string userId)
        {
            APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>($"/api/Account/GetUser?userId={userId}");

            
            if (resp.Code > 0)
            {
                var jsonData = JsonSerializer.Deserialize<JsonElement>(resp.Data.ToString());

                if (jsonData.TryGetProperty("Users", out var usersJson) && usersJson.GetArrayLength() > 0)
                {
                   return JsonSerializer.Deserialize<AddUpdateUserRequest>(usersJson[0].GetRawText());
                }
            }

            return new AddUpdateUserRequest() { UserId = "-1"};

        }

        public async Task<bool> UpdateUserProfile(AddUpdateUserRequest userUpdateRequest)
        {
            var resp = await _apiClientHelper.PostAsync<AddUpdateUserRequest, APIResponse>("/api/Account/UpdateUser", userUpdateRequest);

            return (resp!=null && resp.Code > 0) ? true : false;
        }

        public async Task<bool> DeleteUser(string userId)
        {
            AddUpdateUserRequest userDeleteReq = new AddUpdateUserRequest()
            {
                UserId = userId,
                DOB = string.Empty,
                FirstName = string.Empty,
                LastName = string.Empty,
                Password = string.Empty,
                Mobile= string.Empty,
                Email = string.Empty,
                FilePath = string.Empty
            };

            var resp = await _apiClientHelper.PostAsync<AddUpdateUserRequest, APIResponse>("/api/Account/DeleteUser", userDeleteReq);

            return (resp != null && resp.Code > 0) ? true : false;
        }

        public async Task<List<UserNotificationPreference>> GetUserNotificationPreferences(string userId)
        {
            

            var resp = await _apiClientHelper.GetAsync<List<UserNotificationPreference>>($"/api/NotificationPreference/GetUserNotificationPreferenceById?userId={userId}");

            return resp.Any() ? resp : new List<UserNotificationPreference>();
        }

        public async Task<bool> UpdateUserNotificationPreference(int userId, int id, bool isCreate)
        {
            bool isUpdated = false;

            UserNotificationPreference userNotificationPreference = new UserNotificationPreference()
            {
                UNPID = 0,
                UserId = userId,
                NPID = id,
                CreatedBy = userId,
                Preference = new NotificationPreference() { NPID = id, CreatedBy = userId.ToString(), Preference = id == 1 ? "Email" : "Phone"}
            };

            if (isCreate)
            {
                var respC = await _apiClientHelper.PostAsync<UserNotificationPreference, bool>("/api/NotificationPreference/SaveOrUpdateUserNotificationPreference?isCreate=true", userNotificationPreference);
                return respC;
            }


            var respD = await _apiClientHelper.GetAsync<bool>($"/api/NotificationPreference/DeleteUserNotificationPreference?unpid={id}");
            return respD;

        }

       
    }
}
