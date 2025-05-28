using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LDPLWEBUI.Models;
using System.Globalization;
using UserManagementService.IRepository;
using UserManagementService.Models;

namespace LDPLWEBUI.Controllers
{
    [Authorize(Roles="ADMIN,INCHARGE,HOD,USER")]
    public class ReportController : Controller
    {
        private readonly IReportRepository _reportRepository;
        public ReportController(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }


        [Authorize(Roles = "ADMIN,INCHARGE,HOD")]
        public async Task<IActionResult> TeamDAReport()
        {
            return View();
        }


        public async Task<IActionResult> MyDAReport()
        {
            return View();
        }

        [Authorize(Roles = "ADMIN,INCHARGE,HOD")]
        public async Task<IActionResult> TeamPunchingReport()
        {
            return View();
        }


        public async Task<IActionResult> MyPunchingReport()
        {
            return View();
        }


        public async Task<IActionResult> DAEntry()
        {
            string uId = HttpContext.User.FindFirst("EmpId")?.Value;
            EmpDetail empDetail = await _reportRepository.GetUserInfo(uId);
            UploadDAViewModel uploadDAViewModel = new UploadDAViewModel()
            {
                EmpId = empDetail.EmpId,
                EmployeeName = empDetail.Name,
                Department = empDetail.Department,
                Manager = empDetail.Manager,
                Role = empDetail.Role
            };

            return View(uploadDAViewModel);
        }


        [HttpPost]
        public async Task<IActionResult> DAEntry(UploadDAViewModel uploadDAViewModel)
        {
            try
            {
                string empId = HttpContext.User.FindFirst("EmpId")?.Value;
                if (string.IsNullOrEmpty(empId))
                {
                    return new JsonResult(new { Status = -1, Data = "Invalid user Id!" });
                }

                bool isValid1 = DateTime.TryParseExact(
                    uploadDAViewModel.FromDate, 
                    "dd/MM/yyyy",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out DateTime fromDate
                );

                bool isValid2 = DateTime.TryParseExact(
                    uploadDAViewModel.ToDate,
                    "dd/MM/yyyy",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out DateTime toDate
                );

                if (!isValid1 || !isValid2 || (fromDate> toDate))
                {
                    return Json(new { Status = -1, Message = "Invalid Date Range Entered" });
                }

                if (uploadDAViewModel.DA<=0)
                {
                    return Json(new { Status = -1, Message = "DA Amount should be greater than 0" });
                }


                //validate files
                var allowedContentTypes = new[] { "image/jpg", "image/jpeg", "image/png", "application/pdf" };
                var maxFileSize = 10 * 1024 * 1024; // 10 MB limit

                if (uploadDAViewModel.Bills != null && uploadDAViewModel.Bills.Count > 0)
                {
                    
                    if(uploadDAViewModel.Bills.Count > 5)
                    {
                        ModelState.AddModelError("Bills", "You can only upload a maximum of 5 files.");
                        return View(uploadDAViewModel);
                    }

                    foreach (var file in uploadDAViewModel.Bills)
                    {
                        if (file.Length > maxFileSize)
                        {
                            ModelState.AddModelError("Bills", $"File size exceeds the limit: {file.FileName}");
                            return View(uploadDAViewModel);
                        }
                        
                        if (!allowedContentTypes.Contains(file.ContentType))
                        {
                            ModelState.AddModelError("Bills", $"Invalid file type: {file.FileName}");
                            return View(uploadDAViewModel);
                        }
                    }
                }
               

                float kmV = await _reportRepository.GetKMValueByDateRange(empId, fromDate, toDate);

                uploadDAViewModel.EmpId = empId;
                DAUploadModel daReq = new DAUploadModel()
                {
                    EmpId = empId,
                    Bills = uploadDAViewModel.Bills,
                    FromDate = fromDate,
                    ToDate = toDate,
                    DA = uploadDAViewModel.DA,
                    Descriptions = uploadDAViewModel.Descriptions,
                    Hotel = uploadDAViewModel.Hotel,
                    KM = kmV,
                    Other = uploadDAViewModel.Other
                };

                var resp = await _reportRepository.UploadDA(daReq);

                if (resp == true)
                {
                    return Json(new { Status = 1, Message = "DA Uploaded Successfully" });
                }

                return Json(new { Status = -1, Message = "DA Upload failed" });
            }
            catch
            {
                return Json(new { Status = -1, Message = "Failed to Upload DA Request" });
            }
        }


        [Authorize(Roles = "ADMIN,INCHARGE,HOD")]
        public async Task<JsonResult> GetTeamDAReportData([FromQuery] ReportRequest? dAReportRequest)
        {
            try
            {
                string empId = HttpContext.User.FindFirst("EmpId")?.Value;
                if (string.IsNullOrEmpty(empId))
                {
                    return new JsonResult(new { Status = -1, Data = "Invalid user Id!" });
                }

                dAReportRequest.EmpId = empId;
                dAReportRequest.IsTeamData = true;
                var daReportData = await _reportRepository.GetDAReport(dAReportRequest);

                return new JsonResult(new { Status = 200, Data = daReportData, Message = "Success" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { Status = -1, Message = ex.Message });
            }
        }

        public async Task<JsonResult> GetMyDAReportData([FromQuery] ReportRequest? reportRequest)
        {
            try
            {
                string empId = HttpContext.User.FindFirst("EmpId")?.Value;
                if (string.IsNullOrEmpty(empId))
                {
                    return new JsonResult(new { Status = -1, Data = "Invalid user Id!" });
                }

                reportRequest.EmpId = empId;
                reportRequest.IsTeamData = false;
                var daReportData = await _reportRepository.GetDAReport(reportRequest);

                return new JsonResult(new { Status = 200, Data = daReportData, Message = "Success" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { Status = -1, Message = ex.Message });
            }
        }

        [Authorize(Roles = "ADMIN,INCHARGE,HOD")]
        public async Task<JsonResult> GetTeamEpunchReportData([FromQuery] ReportRequest? reportRequest)
        {
            try
            {
                string empId = HttpContext.User.FindFirst("EmpId")?.Value;
                if (string.IsNullOrEmpty(empId))
                {
                    return new JsonResult(new { Status = -1, Data = "Invalid user Id!" });
                }

                reportRequest.EmpId = empId;
                reportRequest.IsTeamData = true;
                var daReportData = await _reportRepository.GetEpunchReport(reportRequest);

                return new JsonResult(new { Status = 200, Data = daReportData, Message = "Success" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { Status = -1, Message = ex.Message });
            }
        }


        public async Task<JsonResult> GetMyEpunchReportData([FromQuery] ReportRequest? reportRequest)
        {
            try
            {
                string empId = HttpContext.User.FindFirst("EmpId")?.Value;
                if (string.IsNullOrEmpty(empId))
                {
                    return new JsonResult(new { Status = -1, Data = "Invalid user Id!" });
                }

                reportRequest.EmpId = empId;
                reportRequest.IsTeamData = false;
                var daReportData = await _reportRepository.GetEpunchReport(reportRequest);

                return new JsonResult(new { Status = 200, Data = daReportData, Message = "Success" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { Status = -1, Message = ex.Message });
            }
        }

        [Authorize(Roles = "ADMIN,INCHARGE,HOD")]
        [HttpPost]
        public async Task<JsonResult> ApproveRejectDA([FromBody] ApproveRejectDAReq approveRejectDAReq)
        {
            try
            {
                string empId = HttpContext.User.FindFirst("EmpId")?.Value;
                if (string.IsNullOrEmpty(empId))
                {
                    return new JsonResult(new { Status = -1, Data = "Invalid User Id!" });
                }

                approveRejectDAReq.ARBy = empId;

                var result = await _reportRepository.ApproveRejectDA(approveRejectDAReq);
                return new JsonResult(new { Status = 200, Data = result, Message = "Success" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { Status = -1, Message = ex.Message });
            }
        }


        [Authorize(Roles = "ADMIN,INCHARGE,HOD")]
        [HttpPost]
        public async Task<JsonResult> MultiApproveRejectDA([FromBody] List<ApproveRejectDAReq> multiApproveRejectDAReq)
        {
            try
            {
                string empId = HttpContext.User.FindFirst("EmpId")?.Value;
                if (string.IsNullOrEmpty(empId))
                {
                    return new JsonResult(new { Status = -1, Success = 0, Failed = 0, Message = "Invalid user!" });
                }

                foreach (var item in multiApproveRejectDAReq)
                {
                    item.ARBy = empId;
                }

                var result = await _reportRepository.MultiApproveRejectDA(multiApproveRejectDAReq);
                return new JsonResult(new { Status = 200, Success = result[true], Failed = result[false], Message = "Completed" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { Status = -1, Success = 0, Failed = 0, Message = ex.Message });
            }
        }

       
       
        public async Task<IActionResult> GetFile(string fileId, string flag)
        {
            try
            {
                if (string.IsNullOrEmpty(fileId))
                {
                    return BadRequest("Invalid File Identifier!");
                }
                var file = await _reportRepository.GetFile(fileId, flag);
                if (file == null || file.FileBytes == null)
                {
                    return NotFound();
                }

                //if(file.ContentType.Equals("application/pdf", StringComparison.InvariantCultureIgnoreCase))
                //{
                //    return File(file.FileBytes, file.ContentType);
                //}

                return File(file.FileBytes, file.ContentType);

            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error while fetching the file.");
            }
        }

       
        public async Task<JsonResult> GetKMValue(DateTime fromDt, DateTime toDt)
        {
            try
            {
                string empId = HttpContext.User.FindFirst("EmpId")?.Value;
                if (string.IsNullOrEmpty(empId))
                {
                    return new JsonResult(new { Status = -1, Data = "Invalid user Id!" });
                }
                float kmValue = await _reportRepository.GetKMValueByDateRange(empId, fromDt, toDt);
                if(kmValue < 0)
                {
                    return new JsonResult(new { Status = -1, Data = "Failed to get KM Value" });
                }

                return new JsonResult(new { Status = 200, Data = kmValue, Message = "Success" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { Status = -1, Message = ex.Message });
            }
        }
    }
}
