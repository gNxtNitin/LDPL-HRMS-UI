using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Models;

namespace UserManagementService.IRepository
{
    public interface IReportRepository
    {
        Task<List<EmpDAReport>> GetDAReport(ReportRequest reportRequest);
        Task<List<EmpEpunchReport>> GetEpunchReport(ReportRequest reportRequest);

        Task<bool> ApproveRejectDA(ApproveRejectDAReq approveRejectDAReq);
        Task<Dictionary<bool,int>> MultiApproveRejectDA(List<ApproveRejectDAReq> approveRejectDAReqList);

        Task<UserFile> GetFile(string fileId, string flag);
        Task<bool> UploadDA(DAUploadModel daReq);

        Task<EmpDetail> GetUserInfo(string userId);

        Task<float> GetKMValueByDateRange(string empId, DateTime fromDate, DateTime toDate);
    }
}
