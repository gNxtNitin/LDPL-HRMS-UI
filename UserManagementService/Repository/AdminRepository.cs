using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using UserManagementService.DTOs.RequestModels;
using UserManagementService.DTOs.ResponseModels;
using UserManagementService.IRepository;
using UserManagementService.Models;
using UserManagementService.Utility.APIHelper;

namespace UserManagementService.Repository
{
    public class AdminRepository : IAdminRepository
    {
        private readonly IApiClientHelper _apiClientHelper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AdminRepository(IApiClientHelper apiClientHelper, IHttpContextAccessor httpContextAccessor)
        {
            _apiClientHelper = apiClientHelper;
            
            //string token = string.Empty;
            //byte[] tokenBytes = null;

            //bool hasToken = httpContextAccessor.HttpContext?.Session?.TryGetValue("user_token", out tokenBytes) ?? false;

            //if (hasToken && tokenBytes != null)
            //{
            //    token = Encoding.UTF8.GetString(tokenBytes);
            //    _apiClientHelper.SetAuthorizationHeader(token);
            //}

            
        }

        public async Task<bool> AddUpdateUser(UserInfo userinfo)
        {
            AddUpdateUserRequest userRequest = new AddUpdateUserRequest()
            {
                UserId = userinfo.UserId,
                FirstName = userinfo.FirstName,
                LastName = userinfo.LastName,
                Email = userinfo.Email,
                Password = string.Empty,
                DOB = userinfo.DOB,
                FilePath = $"~/app-assets/img/avatars/{new Random().Next(1, 15)}.png",
                Mobile = userinfo.Mobile
            };

            //new user  -- add request
            if (userRequest.UserId == "0")
            {
                APIResponse addResp = await _apiClientHelper.PostAsync<AddUpdateUserRequest, APIResponse>("/api/Account/CreateUser", userRequest);

                return addResp.Code > 0 ? true : false;
            }

            //update request

            APIResponse updateResp = await _apiClientHelper.PostAsync<AddUpdateUserRequest, APIResponse>("/api/Account/UpdateUser", userRequest);


            return updateResp.Code > 0 ? true : false;
        
        }
            

        public async Task<bool> DeleteUser(UserInfo userinfo)
        {
            AddUpdateUserRequest userRequest = new AddUpdateUserRequest()
            {
                UserId = userinfo.UserId,
                FirstName = userinfo.FirstName,
                LastName = userinfo.LastName,
                Email = userinfo.Email,
                Password = string.Empty,
                DOB = userinfo.DOB,
                FilePath = string.Empty,
                Mobile = userinfo.Mobile
            };


            if (userRequest.UserId == "0")
                return false;

            APIResponse delResp = await _apiClientHelper.PostAsync<AddUpdateUserRequest, APIResponse>("/api/Account/DeleteUser", userRequest);

            return delResp.Code > 0 ? true : false;
        }

        public async Task<List<UserInfo>> GetAllUsers()
        {
            APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>($"/api/Account/GetUser?userId=");


            if (resp.Code > 0)
            {
                var jsonData = JsonSerializer.Deserialize<JsonElement>(resp.Data.ToString());

                if (jsonData.TryGetProperty("Users", out var usersJson) && usersJson.GetArrayLength() > 0)
                {
                    return JsonSerializer.Deserialize<List<UserInfo>>(usersJson.GetRawText(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true});
                }
            }

            return new List<UserInfo>();
        }

       

        public async Task<bool> UpdatePasswordPolicy(PasswordPolicyValidatonRule passwordPolicy)
        {
            APIResponse resp = await _apiClientHelper.PostAsync<PasswordPolicyValidatonRule, APIResponse>($"/api/PasswordManagement/UpdatePasswordPolicy", passwordPolicy);

            return resp.Code > 0 ? true : false;

        }

        public async Task<bool> UpdateUserRoleById(string userId, string roleId)
        {
            AssignRoleReqModel assignRoleReqModel = new AssignRoleReqModel()
            {
                UserId = userId,
                RoleId = roleId
            };

            APIResponse resp = await _apiClientHelper.PostAsync<AssignRoleReqModel, APIResponse>("/api/RolesManagement/UpdateUserRole", assignRoleReqModel);

            return resp.Code > 0 ? true : false;
        }

        public async Task<List<RoleResponse>> GetRolesWithUsers()
        {
            APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>($"/api/RolesManagement/GetRolesWithUsers");


            try
            {
                if (resp.Code > 0)
                {
                    return JsonSerializer.Deserialize<List<RoleResponse>>(resp.Data.ToString());
                   
                }
            }
            catch (Exception ex)
            {

            }

            return new List<RoleResponse>();
        }
        public async Task<bool> CreateRole(RoleMasterReqModel rm)
        {
            try
            {
                rm.RoleId = string.Empty;
                APIResponse respBody = await _apiClientHelper.PostAsync<RoleMasterReqModel, APIResponse>("/api/RolesManagement/CreateRole", rm);

                if (respBody.Code > 0)
                {


                    return true;
                }
            }
            catch (Exception ex)
            {

            }

            return false;
        }
        public async Task<bool> UpdateRole(RoleMasterReqModel rm)
        {

            APIResponse respBody = await _apiClientHelper.PostAsync<RoleMasterReqModel, APIResponse>("/api/RolesManagement/UpdateRole", rm);

            if (respBody.Code > 0)
            {


                return true;
            }

            return false;
        }
        public async Task<bool> DeleteRole(RoleMasterReqModel rm)
        {

            APIResponse respBody = await _apiClientHelper.PostAsync<RoleMasterReqModel, APIResponse>("/api/RolesManagement/DeleteRole", rm);

            if (respBody.Code > 0)
            {
                return true;
            }

            return false;
        }

        public async Task<List<RoleMenuAccess>> GetMenuByRole(int roleId)
        {
            APIResponse apiResp = await _apiClientHelper.GetAsync<APIResponse>($"/api/MenuManagement/GetMenuByRole?roleId={roleId}");

            if(apiResp!=null && apiResp.Code > 0)
            {
                var roleMenus = JsonSerializer.Deserialize<List<RoleMenuAccess>>(apiResp.Data.ToString());

                if (roleMenus != null)
                    return roleMenus;
            }

            return new List<RoleMenuAccess>();

        }
    }
}
