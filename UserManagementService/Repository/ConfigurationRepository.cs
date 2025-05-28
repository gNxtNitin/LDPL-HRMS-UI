using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using UserManagementService.DTOs.ResponseModels;
using UserManagementService.IRepository;
using UserManagementService.Models;
using UserManagementService.Utility.APIHelper;

namespace UserManagementService.Repository
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly IApiClientHelper _apiClientHelper;
        public ConfigurationRepository(IApiClientHelper apiClientHelper)
        {
            _apiClientHelper = apiClientHelper;
        }

        public async Task<PasswordPolicyMaster> GetPasswordPolicy()
        {
            PasswordPolicyMaster passwordPolicy = null;

            APIResponse apiResp = await _apiClientHelper.GetAsync<APIResponse>($"/api/PasswordManagement/GetPasswordPolicy");

            if (apiResp.Code > 0)
            {
                var jsonData = JsonSerializer.Deserialize<JsonElement>(apiResp.Data.ToString());

                if (jsonData.TryGetProperty("Table", out var dataJson) && dataJson.GetArrayLength() > 0)
                {
                    passwordPolicy = JsonSerializer.Deserialize<PasswordPolicyMaster>(dataJson[0].GetRawText());
                }
            }

            return passwordPolicy;
        }

        public async Task<bool> UpdatePasswordPolicy(PasswordPolicyMaster passwordPolicy)
        {
            APIResponse resp = await _apiClientHelper.PostAsync<PasswordPolicyMaster, APIResponse>($"/api/PasswordManagement/UpdatePasswordPolicy", passwordPolicy);

            return resp.Code > 0 ? true : false;
        }
    }
}
