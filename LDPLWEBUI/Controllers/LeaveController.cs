using Microsoft.AspNetCore.Mvc;
using UserManagementService.IRepository;
using UserManagementService.Models;
using UserManagementService.Repository;

namespace LDPLWEBUI.Controllers
{
    public class LeaveController : Controller
    {
        private readonly ILeaveRepository _leaveRepository;
        public LeaveController(ILeaveRepository leaveRepository)
        {
            _leaveRepository = leaveRepository;
        }
        public IActionResult LeaveReport()
        {
            return View();
        }
        public IActionResult TeamLeaveReport()
        {
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> MultiApproveTeamLeave([FromBody] List<LeaveRequestModel> lrm)
        {
            try
            {
                string empId = HttpContext.User.FindFirst("EmpId")?.Value;
                if (string.IsNullOrEmpty(empId))
                {
                    return new JsonResult(new { Status = -1, Success = 0, Failed = 0, Message = "Invalid user!" });
                }
                var result = await _leaveRepository.MultiApproveTeamLeaveReport(lrm);
                return new JsonResult(new { Status = 200, Success = result[true], Failed = result[false], Message = "Completed" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { Status = -1, Success = 0, Failed = 0, Message = ex.Message });
            }
        }
        [HttpPost]
        public async Task<JsonResult> ApproveTeamLeave([FromBody] LeaveRequestModel sr1)
        {
            sr1.EmpCode = HttpContext.User.FindFirst("EmpId")?.Value;
            var res = await _leaveRepository.ApproveTeamLeaveReport(sr1);
            return res ? new JsonResult(new { code = 1, message = "Leave request updated successfully." }) : new JsonResult(new { code = -1, message = "Failed to update leave request." });
            
        }
        public async Task<JsonResult> GetTeamLeaveReport()
        {
            string empcode = HttpContext.User.FindFirst("EmpId")?.Value;

            var items = await _leaveRepository.GetTeamLeaveReport(empcode);

            return Json(items);
        }
        public async Task<JsonResult> GetAllLeave()
        {
            string empcode = HttpContext.User.FindFirst("EmpId")?.Value;
            
            var items = await _leaveRepository.GetLeaveReport(empcode);

            return Json(items);
        }
        [HttpPost]
        public async Task<JsonResult> AddUpdateDeleteLeave(LeaveRequestModel sr1)
        {
            sr1.EmpCode = HttpContext.User.FindFirst("EmpId")?.Value;
            var res = await _leaveRepository.CreateUpdateDeleteLeaveReport(sr1);
            return res ? new JsonResult(new { code = 1, message = "Leave request sent successfully." }) : new JsonResult(new { code = -1, message = "Failed to create leave request." });
            //if (sr1.flag == "C")
            //{
            //return res.Code > 0 ? new JsonResult(new { code = 1, message = "Zone created successfully." }) : new JsonResult(new { code = -1, message = "Failed to create zone." });
            //}
            //else
            //{
            //    if (res.Code > 0)
            //    {
            //        return new JsonResult(new { code = 1, message = "Zone deleted successfully." });
            //    }
            //    else
            //    {
            //        return res.Code != -5 ? new JsonResult(new { code = -1, message = "Something Went Wrong" }) : new JsonResult(new { code = -5, message = "Zone can't be deleted as It is assigned to a user." });
            //    }

            //}
        }
    }
}
