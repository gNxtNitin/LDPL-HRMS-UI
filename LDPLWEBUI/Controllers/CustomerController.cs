using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LDPLWEBUI.Models;
using System;
using System.Diagnostics;
using System.Security.Claims;
using System.Text.Json;
using UserManagementService.IRepository;
using UserManagementService.Models;
using UserManagementService.Repository;


namespace LDPLWEBUI.Controllers
{
    [Authorize(Roles= "CUSTOMER")]
    public class CustomerController : Controller
    {
        private readonly ICustomerRepository _customerRepository;
       
        private IConfiguration _configuration;
        public CustomerController(ICustomerRepository customerRepository, IConfiguration configuration)
        {
            _customerRepository = customerRepository;
            _configuration = configuration;
        }

        //public async Task<IActionResult> Index()
        //{
        //    return View("Dashboard2");
        //}

        public async Task<JsonResult> GetAllItems()
        {
            string companycode = HttpContext.User.FindFirst("CompanyCode")?.Value;
            var items = await _customerRepository.GetAllItems(companycode);

            return Json(items);
        }
        public async Task<JsonResult> GetOrderMaster()
        {
            string customer = HttpContext.User.FindFirst("CustomerId")?.Value;
            string company = HttpContext.User.FindFirst("CompanyCode")?.Value;

            var orders = await _customerRepository.GetOrderDetailsMaster(customer, company);

            return Json(orders);
        }
        public async Task<JsonResult> GetOrderItem(string cid)
        {
            string customer = HttpContext.User.FindFirst("CustomerId")?.Value;
            string company = HttpContext.User.FindFirst("CompanyCode")?.Value;


            var orders = await _customerRepository.GetOrderDetailsItem(customer, company, cid);

            return Json(orders);
        }
        public async Task<JsonResult> GetOrderInvoice(string? cid1, string? cid2, string? cid3)
        {
            try
            {
                string customer = HttpContext.User.FindFirst("CustomerId")?.Value;
                string company = HttpContext.User.FindFirst("CompanyCode")?.Value;


                var orders = await _customerRepository.GetOrderInvoice(customer, company, cid1, cid2,cid3);

                return Json(orders);
            }
            catch(Exception ex)
            {
                //return Json(ex);
            }
            return Json(0);
        }
        public async Task<IActionResult> Orders()
        {
            ViewBag.ErCode = TempData["CDCode"] as string;
            ViewBag.ErMsg = TempData["CDMessage"] as string;

            return View();
        }
        public async Task<IActionResult> Invoices()
        {
            ViewBag.ErCode = TempData["IVCode"] as string;
            ViewBag.ErMsg = TempData["IVMessage"] as string;
            //var inv = await _customerRepository.GetInvoicedetails("3202429520");
            return View();
        }
        public async Task<IActionResult> ViewPdf(string cid)
        {
            try
            {
                string folderPath = _configuration.GetValue<string>("InvoicePath");
                string filePath = Path.Combine(folderPath, $"Invoice_{cid}.pdf");
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }


                byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
                return File(fileBytes, "application/pdf");
            }
            catch(Exception ex)
            {
                return NotFound();
            }
        }
        public async Task<IActionResult> ViewInvoices(string? cid)
        {
            try
            {
                string customer = HttpContext.User.FindFirst("CustomerId")?.Value;
                string company = HttpContext.User.FindFirst("CompanyCode")?.Value;
                var inv = await _customerRepository.GetInvoicedetails(cid, customer, company);
                string exePath = _configuration.GetValue<string>("ExecutablePath");// Make sure the path is correct
                string CompanyCode = inv[0].CompanyCode.ToString();
                string Mkey = inv[0].Mkey;
                string Fyear = inv[0].FYear;
                string User = inv[0].AddUser;
                var process = new Process();
                process.StartInfo.FileName = exePath;
                process.StartInfo.Arguments = $"{CompanyCode} {Mkey} {Fyear} {User}"; // space-separated args
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.RedirectStandardOutput = true;
                process.Start();

                string output = process.StandardOutput.ReadToEnd();
                process.WaitForExit();
                ViewBag.mkey = inv[0].Mkey;
                return View();
            }
            catch(Exception ex)
            {
                TempData["IVCode"] = "-1";
                TempData["IVMessage"] = "Invoice is not available at the moment!";
                return RedirectToAction("Invoices", "Customer");
            }
        }
        public async Task<IActionResult> OrderEntry()
        {
            string customer = HttpContext.User.FindFirst("CustomerId")?.Value;
            string company = HttpContext.User.FindFirst("CompanyCode")?.Value;

            var orders = await _customerRepository.GetAllItems(company);
            //ViewBag.Companies = orders;
            return View();
        }
        [HttpPost("CreateOrder")]
        public async Task<IActionResult> CreateOrder(string sr1)
        {
            try
            {
                string customer = HttpContext.User.FindFirst("CustomerId")?.Value;
                string company = HttpContext.User.FindFirst("CompanyCode")?.Value;
                OrderDetailViewModel orderDetail = JsonSerializer.Deserialize<OrderDetailViewModel>(sr1);
                //return Json("p");
                orderDetail.CompanyCode = company;
                orderDetail.SuppCustCode = customer;
                bool res = await _customerRepository.CreateOrder(orderDetail);
                if (res)
                {
                    TempData["CDCode"] = "1";
                    TempData["CDMessage"] = "Order created successfully!";
                }
                //else
                //{
                //    TempData["CUDCode"] = "0";
                //    TempData["CUDMessage"] = "Something Went Wrong";
                //}
                return res ? new JsonResult(new { code = 1, message = "Item created successfully." }) : new JsonResult(new { code = -1, message = "Failed." });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = -1, message = "Failed." });
            }
        }
        [HttpPost("UpdateOrder")]
        public async Task<IActionResult> UpdateOrder(string sr1)
        {
            try
            {
                string customer = HttpContext.User.FindFirst("CustomerId")?.Value;
                string company = HttpContext.User.FindFirst("CompanyCode")?.Value;
                OrderDetailViewModel orderDetail = JsonSerializer.Deserialize<OrderDetailViewModel>(sr1);
                orderDetail.CompanyCode = company;
                orderDetail.SuppCustCode = customer;
                bool res = await _customerRepository.UpdateOrder(orderDetail);
                
                return res ? new JsonResult(new { code = 1, message = "Item updated successfully." }) : new JsonResult(new { code = -1, message = "Failed." });
                //return Json('p');
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = -1, message = "Failed." });
            }
        }
        [HttpPost("DeleteOrder")]
        public async Task<IActionResult> DeleteOrder(string sr1)
        {
            try
            {
                string customer = HttpContext.User.FindFirst("CustomerId")?.Value;
                string company = HttpContext.User.FindFirst("CompanyCode")?.Value;
                OrderDetailViewModel orderDetail = JsonSerializer.Deserialize<OrderDetailViewModel>(sr1);
                orderDetail.CompanyCode = company;
                orderDetail.SuppCustCode = customer;
                bool res = await _customerRepository.DeleteOrder(orderDetail);
               
                return res ? new JsonResult(new { code = 1, message = "Item deleted successfully." }) : new JsonResult(new { code = -1, message = "Failed." });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = -1, message = "Failed." });
            }
        }
        public async Task<IActionResult> OrderDetails(string ck)
        {
            //string customer = HttpContext.User.FindFirst("CustomerId")?.Value;
            //string company = HttpContext.User.FindFirst("CompanyCode")?.Value;

            //var orders = await _customerRepository.GetOrderDetailsMaster(customer, company);
            ViewBag.ErCode = TempData["CUDCode"] as string;
            ViewBag.ErMsg = TempData["CUDMessage"] as string;
            ViewBag.reqstr = ck;

            return View();
        }
        [HttpGet]
        public IActionResult GetGR(string sr1)
        {
            if (string.IsNullOrEmpty(sr1))
                return BadRequest("File name is required.");
            var rootP = _configuration.GetValue<string>("GRPath");
            var filePath = Path.Combine(rootP, $"{sr1}.jpg");

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var bytes = System.IO.File.ReadAllBytes(filePath);
            return File(bytes, "image/jpeg");
        }
        public async Task<JsonResult> DbMetric([FromQuery] string p = "W")
        {
            try
            {
                DashboardMetricRequest req = new DashboardMetricRequest()
                {
                    CompanyCode = User.FindFirst("CompanyCode")?.Value ?? "0",
                    CustomerCode = User.FindFirst("CustomerId")?.Value ?? "0000",
                    DataRange = "W"
                };

                if(string.IsNullOrEmpty(p) || (p.Trim().ToUpper() != "W" && p.Trim().ToUpper() != "M"))
                {
                    req.DataRange = "W";
                }
                else
                {
                    req.DataRange = p.Trim();
                }

                var dsbData = await _customerRepository.GetDashboardMetric(req);
                return new JsonResult(dsbData);
            }
            catch(Exception ex)
            {
                return new JsonResult(null);
            }
        }


        public async Task<JsonResult> DbMetric2([FromQuery] int tabId = 1)
        {
            try
            {
                DashboardMetricRequest2 req = new DashboardMetricRequest2()
                {
                    CompanyCode = User.FindFirst("CompanyCode")?.Value ?? "0",
                    CustomerCode = User.FindFirst("CustomerId")?.Value ?? "0000",
                    TabId = "T1"
                };


                if (tabId>0 && tabId<=3)
                {
                    req.TabId = "T"+tabId.ToString();
                }
                else
                {
                    return new JsonResult(null);
                }

                var dsbData = await _customerRepository.GetDashboardMetric2(req);
                return new JsonResult(dsbData);
            }
            catch (Exception ex)
            {
                return new JsonResult(null);
            }
        }
    }
}
