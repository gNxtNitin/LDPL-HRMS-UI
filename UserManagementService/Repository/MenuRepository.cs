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
    public class MenuRepository : IMenuRepository
    {
        private readonly IApiClientHelper _apiClientHelper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MenuRepository(IApiClientHelper apiClientHelper, IHttpContextAccessor httpContextAccessor)
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

        public async Task<List<MenuMaster>> GetMenuByUserId(string userId)
        {
            Dictionary<string, string> q = new Dictionary<string, string>();
            q.Add("userId", userId.ToString());
            q.Add("meuId", string.Empty);


            APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/MenuManagement/GetMenuById", q);

            if (resp.Code > 0)
            {
                List<MenuMaster> list = JsonSerializer.Deserialize<List<MenuMaster>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                return list;
            }

            return new List<MenuMaster>();
        }

        public async Task<List<MenuFeatures>> GetUserMenuFeatures(int userId, int menuId)
        {
            Dictionary<string, string> queryParam = new Dictionary<string, string>();
            queryParam.Add("userId", userId.ToString());
            queryParam.Add("menuId", menuId.ToString());

            APIResponse apiResp = await _apiClientHelper.GetAsync<APIResponse>("/api/MenuManagement/GetMenuFeatures", queryParam);

            if (apiResp != null && apiResp.Code > 0)
            {
                var jsonData = JsonSerializer.Deserialize<JsonElement>(apiResp.Data.ToString());

                if (jsonData.TryGetProperty("Table", out var dataJson) && dataJson.GetArrayLength() > 0)
                {
                    var menuFeatures = JsonSerializer.Deserialize<List<MenuFeatures>>(dataJson.GetRawText());
                    return menuFeatures;
                }
            }

            return new List<MenuFeatures>();

        }

        public async Task<List<MenuMaster>> GetMenuMaster()
        {
           APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/MenuManagement/GetAllMenu");

            if (resp.Code > 0)
            {
                List<MenuMaster> list = JsonSerializer.Deserialize<List<MenuMaster>>(resp.Data.ToString());
                return list;
            }

            return new List<MenuMaster>();
        }

        public Task<List<FeatureMaster>> GetMenuFeatureMaster()
        {
            throw new NotImplementedException();
        }
    }
}
