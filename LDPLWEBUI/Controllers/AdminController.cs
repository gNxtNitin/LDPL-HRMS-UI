using System.Collections.Generic;
using System.Text.Json;
//using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using UserManagementService.IRepository;
using UserManagementService.Models;
using UserManagementService.Repository;
using LDPLWEBUI.Models;
using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using LDPLWEBUI.Utility;

namespace LDPLWEBUI.Controllers
{
    [Authorize(Roles ="ADMIN")]
    public class AdminController : Controller
    {
        private readonly IAdminPortalRepository _adminPortalRepository;
        public AdminController(IAdminPortalRepository adminPortalRepository)
        {
            _adminPortalRepository = adminPortalRepository;
        }

        public IActionResult Dashboard()
        {
            return View();
        }

        public async Task<IActionResult> City()
        {
            //ViewBag.ErCode = TempData["CDCode"] as string;
            //ViewBag.ErMsg = TempData["CDMessage"] as string;
            return View();
        }
        public async Task<IActionResult> Schools()
        {
            ViewBag.emp = HttpContext.User.FindFirst("EmpId")?.Value;
            return View();
        }
        public async Task<IActionResult> SchoolIncharge()
        {
            return View();
        }
        public async Task<IActionResult> Employees()
        {
            return View();
        }
        [HttpPost("AddUpdateDeleteCity")]
        public async Task<JsonResult> AddUpdateDeleteCity(CityRequestModel sr1)
        {
            var res = await _adminPortalRepository.CreateUpdateDeleteCity(sr1);
            //if (res.Code > 0)
            //{
            //    if (sr1.flag == "C")
            //    {
            //        TempData["CDCode"] = "1";
            //        TempData["CDMessage"] = "City created successfully!";
            //    }
            //    else
            //    {
            //        TempData["CDCode"] = "1";
            //        TempData["CDMessage"] = "City deleted successfully!";
            //    }
            //}
            if (sr1.flag == "C")
            {
                return res.Code > 0 ? new JsonResult(new { code = 1, message = "City created successfully." }) : new JsonResult(new { code = -1, message = "Failed to create city." });
            }
            else
            {
                if (res.Code > 0)
                {
                    return new JsonResult(new { code = 1, message = "City deleted successfully." });
                }
                else
                {
                    return res.Code != -5 ? new JsonResult(new { code = -1, message = "Something Went Wrong" }) : new JsonResult(new { code = -5, message = "City can't be deleted as it is assigned to a school." });
                }
                //return res ? new JsonResult(new { code = 1, message = "City deleted successfully." }) : new JsonResult(new { code = -1, message = "Failed." });
            }
        }
        public async Task<IActionResult> Zone()
        {
            //ViewBag.ErCode = TempData["CDCode"] as string;
            //ViewBag.ErMsg = TempData["CDMessage"] as string;
            return View();
        }
        [HttpPost("AddUpdateDeleteZone")]
        public async Task<JsonResult> AddUpdateDeleteZone(ZoneRequestModel sr1)
        {
            var res = await _adminPortalRepository.CreateUpdateDeleteZone(sr1);
            //if (res.Code > 0)
            //{
            //    if (sr1.flag == "C")
            //    {
            //        TempData["CDCode"] = "1";
            //        TempData["CDMessage"] = "Zone created successfully!";
            //    }
            //    else
            //    {
            //        TempData["CDCode"] = "1";
            //        TempData["CDMessage"] = "Zone deleted successfully!";
            //    }
            //}
            if (sr1.flag == "C")
            {
                return res.Code > 0 ? new JsonResult(new { code = 1, message = "Zone created successfully." }) : new JsonResult(new { code = -1, message = "Failed to create zone." });
            }
            else
            {
                if (res.Code > 0)
                {
                    return new JsonResult(new { code = 1, message = "Zone deleted successfully." });
                }
                else
                {
                    return res.Code != -5 ? new JsonResult(new { code = -1, message = "Something Went Wrong" }) : new JsonResult(new { code = -5, message = "Zone can't be deleted as It is assigned to a user." });
                }
                    
            }
        }
        [HttpPost("AddUpdateDeleteSchool")]
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
            var res = await _adminPortalRepository.CreateUpdateDeleteSchool(schoolRequest);
            //if (res)
            //{
                //if (sr1.flag == "C")
                //{
                //    TempData["CDCode"] = "1";
                //    TempData["CDMessage"] = "School created successfully!";
                //}
                //else
                //{
                //    TempData["CDCode"] = "1";
                //    TempData["CDMessage"] = "School deleted successfully!";
                //}
            //}
            if (sr1.flag == "C")
            {
                return res ? new JsonResult(new { code = 1, message = "School created successfully." }) : new JsonResult(new { code = -1, message = "Failed to create school record." });
            }
            else if(sr1.flag == "U")
            {
                return res ? new JsonResult(new { code = 1, message = "School updated successfully." }) : new JsonResult(new { code = -1, message = "Failed to updated school record." });
            }
            else
            {
                return res ? new JsonResult(new { code = 1, message = "School deleted successfully." }) : new JsonResult(new { code = -1, message = "Failed to delete school record." });
            }
        }
        [HttpPost("AddUpdateDeleteEmployee")]
        public async Task<JsonResult> AddUpdateDeleteEmployee(EmployeeViewModel sr1)
        {
            if (!ModelState.IsValid && (sr1.flag == "C" || sr1.flag == "U"))
            {
                // Optionally return specific validation errors
                return new JsonResult(new { code = -1, message = "Invalid Inputs." });
            }
            return new JsonResult(new { code = 1, message = "Employee created successfully." });
            //EmployeeRequestModel req = new EmployeeRequestModel
            //{
            //    flag = sr1.flag ?? "G",
            //    Id = null, // or set based on your logic
            //    UserRoleId = sr1.UserRoleId,
            //    EmpId = sr1.EmpId,
            //    EName = sr1.EName,
            //    Email = sr1.Email,
            //    //EFName = sr1.EFName,
            //    Password = string.IsNullOrEmpty( sr1.Password ) ?  sr1.Password : PasswordConfig.GetMd5Hash(sr1.Password),
            //    Designation = sr1.Designation,
            //    Department = sr1.Department,
            //    //Gender = sr1.Gender,
            //    Mobile = sr1.Mobile,
            //    Address = sr1.Address,
            //    LogDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), // or any required format
            //    AccountManager = sr1.AccountManager
            //};
            
            //var res = await _adminPortalRepository.CreateUpdateDeleteEmployee(req);
            
            //if (sr1.flag == "C")
            //{
            //    return res ? new JsonResult(new { code = 1, message = "Employee created successfully." }) : new JsonResult(new { code = -1, message = "Failed to add employee." });
            //}
            //else if (sr1.flag == "D")
            //{
            //    return res ? new JsonResult(new { code = 1, message = "Employee deleted successfully." }) : new JsonResult(new { code = -1, message = "Failed to delete employee." });
            //}
            //else if (sr1.flag == "P")
            //{
            //    return res ? new JsonResult(new { code = 1, message = "Password Updated successfully." }) : new JsonResult(new { code = -1, message = "Failed to update password." });
            //}
            //else
            //{
            //    return res ? new JsonResult(new { code = 1, message = "Employee updated successfully." }) : new JsonResult(new { code = -1, message = "Failed to updated employee." });
            //}
        }
        public async Task<JsonResult> GetSchoolIncharge()
        {
            var items = await _adminPortalRepository.GetSchoolIncharge();
            var kk = JsonSerializer.Deserialize<List<Object>>(items);
            return Json(kk);




        }
        [HttpPost]
        public async Task<JsonResult> AssignSchoolIncharge(SchoolViewModel sr1)
        {
            //if (!ModelState.IsValid && sr1.flag == "C")
            //{
            //    // Optionally return specific validation errors
            //    return new JsonResult(new { code = -1, message = "Invalid Inputs." });
            //}
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
            var res = await _adminPortalRepository.AssignSchoolIncharge(schoolRequest);
            
            return res ? new JsonResult(new { code = 1, message = "Incharge assigned successfully!" }) : new JsonResult(new { code = -1, message = "Failed." });
        }
        public async Task<JsonResult> GetData(string sr1, string? sr2)
        {
            if(sr1 == "U" || sr1 == "E" || sr1 == "I")
            {
                sr2 = HttpContext.User.FindFirst("EmpId")?.Value;
                var items = await _adminPortalRepository.GetData(sr1, sr2);

                //var kk = JsonConvert.SerializeObject(items, Formatting.Indented);
                //List<dynamic> list = JsonConvert.DeserializeObject<List<dynamic>>(items);
                //List<UserDetailsModel> list = JsonSerializer.Deserialize<List<UserDetailsModel>>(items, new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                //return Json(list);
                return Json(items);
            }
            //string companycode = HttpContext.User.FindFirst("CompanyCode")?.Value;
            else if(sr1 == "Z")
            {
                var items = await _adminPortalRepository.GetData(sr1, sr2);
                List<ZoneRequestModel> list = JsonSerializer.Deserialize<List<ZoneRequestModel>>(items, new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                return Json(list);
                //return Json("items");
            }
            else
            {
                return Json("items");
            }
            


            
        }
        public async Task<JsonResult> GetAllCity()
        {
            //string companycode = HttpContext.User.FindFirst("CompanyCode")?.Value;
            var items = await _adminPortalRepository.GetAllCity();

            return Json(items);
        }

        public async Task<JsonResult> GetAllZone()
        {
            //string companycode = HttpContext.User.FindFirst("CompanyCode")?.Value;
            var items = await _adminPortalRepository.GetAllZone();

            return Json(items);
        }
        public async Task<JsonResult> GetAllSchool()
        {
            string empid = HttpContext.User.FindFirst("EmpId")?.Value;
            var items = await _adminPortalRepository.GetAllSchool(empid);

            return Json(items);
        }
        public async Task<JsonResult> GetAllEmployees()
        {
            //string companycode = HttpContext.User.FindFirst("CompanyCode")?.Value;
            var items = await _adminPortalRepository.GetAllEmployees();

            return Json(items);
        }
    }
}
