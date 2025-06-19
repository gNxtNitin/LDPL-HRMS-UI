using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Models;

namespace UserManagementService.IRepository
{
    public interface ILeaveRepository
    {
        Task<List<LeaveRequestModel>> GetLeaveReport(string empcode);
        Task<bool> CreateUpdateDeleteLeaveReport(LeaveRequestModel srm);
        Task<List<LeaveRequestModel>> GetTeamLeaveReport(string empcode);
        Task<bool> ApproveTeamLeaveReport(LeaveRequestModel srm);
        Task<Dictionary<bool, int>> MultiApproveTeamLeaveReport(List<LeaveRequestModel> srm);

    }
}
