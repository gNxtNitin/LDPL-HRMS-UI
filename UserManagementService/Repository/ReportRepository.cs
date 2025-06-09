using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using UserManagementService.DTOs.ResponseModels;
using UserManagementService.IRepository;
using UserManagementService.Models;
using UserManagementService.Utility.APIHelper;

namespace UserManagementService.Repository
{
    internal class ReportRepository : IReportRepository
    {
        private readonly IApiClientHelper _apiClientHelper;
        public ReportRepository(IApiClientHelper apiClientHelper)
        {
            _apiClientHelper = apiClientHelper;
        }
        public async Task<List<EmpDAReport>> GetDAReport(ReportRequest reportRequest)
        {
            try
            {
                var queryParams = new Dictionary<string, string>();

                queryParams.Add("EmpId", reportRequest.EmpId);
                queryParams.Add("DTRangeFrom", reportRequest.DTRangeFrom.ToString("yyyy-MM-dd"));
                queryParams.Add("DTRangeTo", reportRequest.DTRangeTo.ToString("yyyy-MM-dd"));
                queryParams.Add("IsTeamData", reportRequest.IsTeamData ? "true" : "false");

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/DA/GetDAReportData", queryParams);

                if (resp.Code>0)
                {
                    List<EmpDAReport> list = JsonSerializer.Deserialize<List<EmpDAReport>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return list;
                }
            }
            catch (Exception ex)
            {

            }

            return new List<EmpDAReport>();
        }

        public async Task<List<EmpEpunchReport>> GetEpunchReport(ReportRequest reportRequest)
        {
            try
            {
                var queryParams = new Dictionary<string, string>();

                queryParams.Add("EmpId", reportRequest.EmpId);
                queryParams.Add("DTRangeFrom", reportRequest.DTRangeFrom.ToString("yyyy-MM-dd"));
                queryParams.Add("DTRangeTo", reportRequest.DTRangeTo.ToString("yyyy-MM-dd"));
                queryParams.Add("IsTeamData", reportRequest.IsTeamData ? "true" : "false");

                APIResponse resp = await _apiClientHelper.GetAsync<APIResponse>("/api/Punching/GetPunchingReportData", queryParams);

                if (resp.Code > 0)
                {
                    List<EmpEpunchReport> list = JsonSerializer.Deserialize<List<EmpEpunchReport>>(resp.Data.ToString(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                    return list;
                }
            }
            catch (Exception ex)
            {

            }

            return new List<EmpEpunchReport>();
        }

        public async Task<bool> ApproveRejectDA(ApproveRejectDAReq approveRejectDAReq)
        {
            try
            {

                APIResponse resp = await _apiClientHelper.PostAsync<ApproveRejectDAReq, APIResponse>("/api/DA/ApproveRejectDA", approveRejectDAReq);

                if (resp.Code>0)
                {
                    return true;
                }
            }
            catch(Exception ex)
            {
            }

            return false;
        }
        //MultiApproveRejectDA

        public async Task<Dictionary<bool, int>> MultiApproveRejectDA(List<ApproveRejectDAReq> approveRejectDAReqList)
        {
            Dictionary<bool, int> result = new Dictionary<bool, int>();
            result.Add(false, 0);
            result.Add(true, 0);

            try
            {

                APIResponse resp = await _apiClientHelper.PostAsync<List<ApproveRejectDAReq>, APIResponse>("/api/DA/MultiApproveRejectDA", approveRejectDAReqList);

                if (resp.Code > 0)
                {
                    result[true] = approveRejectDAReqList.Count;
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
                result[false] = approveRejectDAReqList.Count;
            }

            return result;
        }

        public async Task<UserFile> GetFile(string fileId, string flag)
        {
            if (string.IsNullOrWhiteSpace(fileId))
            {
                return EmptyFile();
            }

            try
            {
                string url = flag.Trim().ToUpper() switch
                {
                    "DA" => $"/api/DA/DABill/{fileId}",
                    "EP" => $"/api/Punching/Ephoto/{fileId}",
                    _ => null
                };

                if (string.IsNullOrEmpty(url))
                {
                    return EmptyFile();
                }

                var file = await _apiClientHelper.GetAsync<UserFile>(url);

                if (file == null || file.FileBytes == null || string.IsNullOrWhiteSpace(file.FileName))
                {
                    return EmptyFile();
                }

                var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant() ?? "";

                file.ContentType = extension switch
                {
                    ".jpg" or ".jpeg" => "image/jpeg",
                    ".png" => "image/png",
                    ".gif" => "image/gif",
                    ".bmp" => "image/bmp",
                    ".webp" => "image/webp",
                    ".pdf" => "application/pdf",
                    _ => string.IsNullOrWhiteSpace(file.ContentType) ? "application/octet-stream" : file.ContentType
                };

                

                return file;
            }
            catch (Exception ex)
            {
                // Log the error (replace with your logging mechanism)
                Console.Error.WriteLine($"Error retrieving file with ID '{fileId}': {ex.Message}");
                return EmptyFile();
            }
        }

        private UserFile EmptyFile() => new UserFile
        {
            FileBytes = null,
            ContentType = "",
            FileName = ""
        };




        public async Task<bool> UploadDA(DAUploadModel daReq)
        {
            bool isSuccess = false;

            try
            {
                var formData = new MultipartFormDataContent();

                formData.Add(new StringContent(daReq.EmpId), "EmpId");
                formData.Add(new StringContent(daReq.DA.ToString()), "DA");
                formData.Add(new StringContent(daReq.KM.ToString()), "KM");
                formData.Add(new StringContent(daReq.FromDate.ToString("o")), "FromDate");
                formData.Add(new StringContent(daReq.ToDate.ToString("o")), "ToDate");

                if (daReq.Hotel.HasValue)
                    formData.Add(new StringContent(daReq.Hotel.Value.ToString()), "Hotel");
                if (daReq.Other.HasValue)
                    formData.Add(new StringContent(daReq.Other.Value.ToString()), "Other");

                if (daReq.Descriptions != null)
                {
                    for (int i = 0; i < daReq.Descriptions.Count; i++)
                    {
                        formData.Add(new StringContent(daReq.Descriptions[i]), $"Descriptions[{i}]");
                    }
                }

                if (daReq.Bills != null)
                {
                    foreach (var file in daReq.Bills)
                    {
                        var ms = new MemoryStream();
                        await file.CopyToAsync(ms);
                        ms.Position = 0;

                        var streamContent = new StreamContent(ms);
                        streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

                        formData.Add(streamContent, "Bills", file.FileName);
                    }
                }


                APIResponse resp = await _apiClientHelper.PostFormDataAsync<APIResponse>("/api/DA/AddDARecord", formData);
                isSuccess = resp.Code > 0;
                
            }
            catch (Exception ex)
            {
                isSuccess = false;
            }

            return isSuccess;
        }

        public async Task<EmpDetail> GetUserInfo(string userId)
        {
            APIResponse apiResp = await _apiClientHelper.GetAsync<APIResponse>($"/api/Auth/Me?uId={userId}");

            if (apiResp.Code > 0)
            {
                EmpDetail empDetail = JsonSerializer.Deserialize<EmpDetail>(apiResp.Data.ToString(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true});

                return empDetail;
            }

            return new EmpDetail();
        }

        public async Task<float> GetKMValueByDateRange(string empId, DateTime fromDate, DateTime toDate)
        {
            float kmValue = 0;
            try
            {
                Dictionary<string, string> queryParams = new Dictionary<string, string>();
                queryParams.Add("userId", empId);
                queryParams.Add("fromDate", fromDate.ToString("yyyy-MM-dd"));
                queryParams.Add("toDate", toDate.ToString("yyyy-MM-dd"));
                APIResponse apiResp = await _apiClientHelper.GetAsync<APIResponse>("/api/DA/GetKMValueByDateRange", queryParams);

                if(apiResp.Code > 0)
                {
                    kmValue = JsonSerializer.Deserialize<float>(apiResp.Data.ToString(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    return kmValue;
                }
            }
            catch (Exception ex)
            {
                return -1;
            }

            return kmValue;
        }
    }
}
