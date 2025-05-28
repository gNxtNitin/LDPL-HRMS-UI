using Microsoft.AspNetCore.Mvc;
using LDPLWEBUI.Models;
using System.Text.Json;
using UserManagementService.IRepository;
using UserManagementService.Models;

namespace LDPLWEBUI.Controllers
{
    public class UserController : Controller
    {
        private readonly IAdminPortalRepository _adminPortalRepository;
        private readonly IUserRepository _userRepository;
        public UserController(IAdminPortalRepository adminPortalRepository, IUserRepository userRepository)
        {
            _adminPortalRepository = adminPortalRepository;
            _userRepository = userRepository;
        }
        public IActionResult AddDARecrod()
        {
            return View();
        }
        public async Task<IActionResult> Schools()
        {
            ViewBag.emp = HttpContext.User.FindFirst("EmpId")?.Value;
            return View();
        }
        public async Task<JsonResult> GetAllSchool()
        {
            string empid = HttpContext.User.FindFirst("EmpId")?.Value;
            var items = await _userRepository.GetAllSchool(empid);

            return Json(items);
        }
        [HttpPost]
        public async Task<JsonResult> AddUpdateDeleteSchool(SchoolViewModel sr1)
        {
            if (!ModelState.IsValid && (sr1.flag == "C" || sr1.flag == "U"))
            {
                // Optionally return specific validation errors
                return new JsonResult(new { code = -1, message = "Invalid Inputs." });
            }
            var schoolRequest = new SchoolRequestModel
            {
                flag = sr1.flag,
                SchoolCode = sr1.SchoolCode,
                SchoolName = sr1.SchoolName,
                EName = sr1.EName,
                EmpId = sr1.EmpId,
                SAddress = sr1.SAddress,
                City = sr1.City,
                State = sr1.State,
                SchoolCategory = sr1.SchoolCategory,
                VendorType = sr1.VendorType,
                AccountManager = sr1.AccountManager,
                Incharge = sr1.Incharge
            };
            var res = await _userRepository.CreateUpdateDeleteSchool(schoolRequest);
          
            if (sr1.flag == "C")
            {
                return res ? new JsonResult(new { code = 1, message = "School created successfully." }) : new JsonResult(new { code = -1, message = "Failed to create school record." });
            }
            else if (sr1.flag == "U")
            {
                return res ? new JsonResult(new { code = 1, message = "School updated successfully." }) : new JsonResult(new { code = -1, message = "Failed to updated school record." });
            }
            else
            {
                return res ? new JsonResult(new { code = 1, message = "School deleted successfully." }) : new JsonResult(new { code = -1, message = "Failed to delete school record." });
            }
        }
        public async Task<JsonResult> GetData(string sr1, string? sr2)
        {
            if (sr1 == "R")
            {
                sr2 = HttpContext.User.FindFirst("EmpId")?.Value;
                var items = await _adminPortalRepository.GetData(sr1, sr2);

                return Json(items);
            }
            //string companycode = HttpContext.User.FindFirst("CompanyCode")?.Value;
            //else if (sr1 == "Z")
            //{
            //    var items = await _adminPortalRepository.GetData(sr1, sr2);
            //    List<ZoneRequestModel> list = JsonSerializer.Deserialize<List<ZoneRequestModel>>(items, new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
            //    return Json(list);
            //    //return Json("items");
            //}
            else
            {
                return Json("items");
            }
        }

    }
}
