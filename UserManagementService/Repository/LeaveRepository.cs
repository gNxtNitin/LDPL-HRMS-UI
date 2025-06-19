using System;
using System.Collections.Generic;
using System.Globalization;
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
    public class LeaveRepository: ILeaveRepository
    {
        private readonly IApiClientHelper _apiClientHelper;
        public LeaveRepository(IApiClientHelper apiClientHelper)
        {
            _apiClientHelper = apiClientHelper;
        }
        public async Task<List<LeaveRequestModel>> GetLeaveReport(string empcode)
        {
            Dictionary<string, string> q = new Dictionary<string, string>();
            q.Add("cid1", empcode);
            //q.Add("cid2", companycode);
            try
            {

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Leave/GetLeaveReport", q);

                if (resp.Code == 1)
                {
                    List<LeaveRequestModel> list = JsonSerializer.Deserialize<List<LeaveRequestModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return list;
                }
            }
            catch (Exception ex)
            {

            }

            return new List<LeaveRequestModel>();
        }
        public async Task<List<LeaveRequestModel>> GetTeamLeaveReport(string empcode)
        {
            Dictionary<string, string> q = new Dictionary<string, string>();
            q.Add("cid1", empcode);
            //q.Add("cid2", companycode);
            try
            {

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Leave/GetTeamLeaveReport", q);

                if (resp.Code == 1)
                {
                    List<LeaveRequestModel> list = JsonSerializer.Deserialize<List<LeaveRequestModel>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return list;
                }
            }
            catch (Exception ex)
            {

            }

            return new List<LeaveRequestModel>();
        }
        public async Task<bool> ApproveTeamLeaveReport(LeaveRequestModel srm)
        {
            try
            {
                object body = new
                {
                    flag = "C",
                    id = srm.AutoKeyRef,
                    empId = srm.EmpCode,
                    //dtRangeFrom = DateTime.ParseExact(srm.FromDate, "MM/dd/yyyy", CultureInfo.InvariantCulture),
                    //dtRangeTo = DateTime.ParseExact(srm.ToDate, "MM/dd/yyyy", CultureInfo.InvariantCulture),
                    //leaveReason = srm.Reason,
                    status = srm.Status == true ? true : false
                };
                APIResponse respBody = await _apiClientHelper.PostAsync<Object, APIResponse>("/api/Leave/ApproveTeamLeaveReport", body);

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
        public async Task<Dictionary<bool, int>> MultiApproveTeamLeaveReport(List<LeaveRequestModel> srm)
        {
            Dictionary<bool, int> result = new Dictionary<bool, int>();
            result.Add(false, 0);
            result.Add(true, 0);
            try
            {
                List<Object> list = new List<Object>();
                foreach (var item in srm)
                {
                    
                    object body = new
                    {
                        flag = "C",
                        id = item.AutoKeyRef,
                        empId = item.EmpCode,
                        
                        status = item.Status == true ? true : false
                    };
                    list.Add(body);
                }
                APIResponse resp = await _apiClientHelper.PostAsync<List<Object>, APIResponse>("/api/Leave/MultiApproveTeamLeaveReport", list);

                if (resp.Code > 0)
                {
                    result[true] = srm.Count;
                    result[false] = 0;
                }
                else
                {
                    MultiApproveStatus data = JsonSerializer.Deserialize<MultiApproveStatus>(resp.Data.ToString());
                    result[false] = data.FailureCount;
                    result[true] = data.SuccessCount;

                }
            }
            catch (Exception ex)
            {
                result[true] = 0;
                result[false] = srm.Count;
            }
            return result;
        }
        public async Task<bool> CreateUpdateDeleteLeaveReport(LeaveRequestModel srm)
        {
            try
            {
                object body = new
                {
                    flag = "C",
                    //id = null,
                    empId = srm.EmpCode,
                    dtRangeFrom = DateTime.ParseExact(srm.FromDate, "MM/dd/yyyy", CultureInfo.InvariantCulture) ,
                    dtRangeTo = DateTime.ParseExact(srm.ToDate, "MM/dd/yyyy", CultureInfo.InvariantCulture),
                    leaveReason = srm.Reason,
                    isHalfDay = int.Parse( srm.HalfDay) > 0 && srm.HalfDay != null ? true : false
                };
                APIResponse respBody = await _apiClientHelper.PostAsync<Object, APIResponse>("/api/Leave/AddUpdateLeaveReport", body);

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
    }
}
