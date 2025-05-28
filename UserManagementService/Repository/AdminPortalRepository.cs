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
    public class AdminPortalRepository: IAdminPortalRepository
    {
        private readonly IApiClientHelper _apiClientHelper;
        public AdminPortalRepository(IApiClientHelper apiClientHelper)
        {
            _apiClientHelper = apiClientHelper;
        }
        public async Task<List<CityRequestModel>> GetAllCity()
        {
            //Dictionary<string, string> q = new Dictionary<string, string>();
            //q.Add("cid1", customerid);
            //q.Add("cid2", companycode);
            try
            {

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Admin/GetAllCity");

                if (resp.Code == 1)
                {
                    List<CityRequestModel> list = JsonSerializer.Deserialize<List<CityRequestModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return list;
                }
            }
            catch (Exception ex)
            {

            }

            return new List<CityRequestModel>();
        }
        public async Task<List<ZoneRequestModel>> GetAllZone()
        {
            //Dictionary<string, string> q = new Dictionary<string, string>();
            //q.Add("cid1", customerid);
            //q.Add("cid2", companycode);
            try
            {

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Admin/GetAllZones");

                if (resp.Code == 1)
                {
                    List<ZoneRequestModel> list = JsonSerializer.Deserialize<List<ZoneRequestModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return list;
                }
            }
            catch (Exception ex)
            {

            }

            return new List<ZoneRequestModel>();
        }
        public async Task<List<SchoolRequestModel>> GetAllSchool(string empid)
        {
            Dictionary<string, string> q = new Dictionary<string, string>();
            q.Add("cid1", empid);
            //q.Add("cid2", companycode);
            try
            {

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Admin/GetAllSchool", q);

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
        public async Task<List<EmployeeRequestModel>> GetAllEmployees()
        {
            //Dictionary<string, string> q = new Dictionary<string, string>();
            //q.Add("cid1", customerid);
            //q.Add("cid2", companycode);
            try
            {

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Admin/GetAllEmployees");

                if (resp.Code == 1)
                {
                    List<EmployeeRequestModel> list = JsonSerializer.Deserialize<List<EmployeeRequestModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return list;
                }
            }
            catch (Exception ex)
            {

            }

            return new List<EmployeeRequestModel>();
        }
        public async Task<string> GetData(string flag,string? cid2)
        {
            Dictionary<string, string> q = new Dictionary<string, string>();
            q.Add("cid1", flag);
            if(cid2 != null)
            {
                q.Add("cid2", cid2);
            }
            //q.Add("cid2", companycode);
            try
            {

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/User/GetData", q);

                if (resp.Code == 1)
                {
                    //List<ZoneRequestModel> list = JsonSerializer.Deserialize<List<ZoneRequestModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return resp.Data.ToString();
                }
            }
            catch (Exception ex)
            {

            }

            return String.Empty;
        }
        public async Task<APIResponse> CreateUpdateDeleteZone(ZoneRequestModel zrm)
        {
            try
            {

                if (zrm.flag != "C")
                {
                    var requestBody = new
                    {
                        flag = zrm.flag,
                        name = zrm.name,
                        zoneId = zrm.ZoneId.ToString()
                    };
                    
                    APIResponse respBody = await _apiClientHelper.PostAsync<Object, APIResponse>("/api/Admin/CreateUpdateDeleteZone", requestBody);
                    return respBody;
                    //APIResponse respBody = await _apiClientHelper.PostAsync<Object, APIResponse>("/api/Admin/CreateUpdateDeleteCity", requestBody);
                    //if (respBody.Code > 0)
                    //{

                    //    return true;
                    //}
                }
                else
                {
                    APIResponse respBody = await _apiClientHelper.PostAsync<ZoneRequestModel, APIResponse>("/api/Admin/CreateUpdateDeleteZone", zrm);
                    return respBody;
                    //if (respBody.Code > 0)
                    //{
                       
                    //    return true;
                    //}
                }

                
            }
            catch(Exception ex)
            {
               // return new APIResponse();
            }
            return new APIResponse();
        }
        public async Task<APIResponse> CreateUpdateDeleteCity(CityRequestModel crm)
        {
            try
            {
                if(crm.flag != "C")
                {
                    var requestBody = new
                    {
                        flag = crm.flag,
                        cname = crm.cname,
                        sname = crm.sname,
                        cityId = crm.CityId.ToString(),
                    };
                    APIResponse respBody = await _apiClientHelper.PostAsync<Object, APIResponse>("/api/Admin/CreateUpdateDeleteCity", requestBody);
                    return respBody;
                    //if (respBody.Code > 0)
                    //{

                    //    return true;
                    //}
                }
                else
                {
                    APIResponse respBody = await _apiClientHelper.PostAsync<CityRequestModel, APIResponse>("/api/Admin/CreateUpdateDeleteCity", crm);
                    return respBody;
                    //if (respBody.Code > 0)
                    //{

                    //    return true;
                    //}
                }
               

                
            }
            catch (Exception ex)
            {

            }
            return new APIResponse();
        }
        public async Task<bool> CreateUpdateDeleteSchool(SchoolRequestModel srm)
        {
            try
            {

                APIResponse respBody = await _apiClientHelper.PostAsync<SchoolRequestModel, APIResponse>("/api/Admin/CreateUpdateDeleteSchool", srm);

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
        public async Task<bool> CreateUpdateDeleteEmployee(EmployeeRequestModel erm)
        {
            try
            {

                var anon = new
                {
                    flag = erm.flag,
                    roleid = erm.UserRoleId,
                    empId = erm.EmpId,
                    zone = erm.Department,
                    eName = erm.EName,
                    email = erm.Email,
                    efName = erm.EFName,
                    password = erm.Password,
                    designation =erm.Designation,
                    department = erm.Department,
                    gender = erm.Gender,
                    mobile = erm.Mobile,
                    address = erm.Address,
                    manager = erm.AccountManager
                };
                APIResponse respBody = await _apiClientHelper.PostAsync<Object, APIResponse>("/api/Admin/CreateUpdateDeleteEmployee", anon);

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
        public async Task<bool> AssignSchoolIncharge(SchoolRequestModel srm)
        {
            try
            {

                APIResponse respBody = await _apiClientHelper.PostAsync<SchoolRequestModel, APIResponse>("/api/Admin/AssignSchoolIncharge", srm);

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
        public async Task<string> GetSchoolIncharge()
        {
            //Dictionary<string, string> q = new Dictionary<string, string>();
            //q.Add("cid1", flag);
            //if (cid2 != null)
            //{
            //    q.Add("cid2", cid2);
            //}
            //q.Add("cid2", companycode);
            try
            {

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Admin/GetSchoolIncharge");

                if (resp.Code == 1)
                {
                    //List<ZoneRequestModel> list = JsonSerializer.Deserialize<List<ZoneRequestModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return resp.Data.ToString();
                }
            }
            catch (Exception ex)
            {

            }

            return String.Empty;
        }
    }
}
