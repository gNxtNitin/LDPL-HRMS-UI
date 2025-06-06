using LDPLWEBUI.Models;
using LDPLWEBUI.Utility;
using LDPLWEBUI.Utility;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using UserManagementService.DTOs.RequestModels;
using UserManagementService.IRepository;
using UserManagementService.Models;
using UserManagementService.Utility;

namespace LDPLWEBUI.Controllers
{
    public class AuthController : Controller
    {
        private IAccountRepository _accountRepository;
        private IMemoryCacheService _memoryCacheService;
        private readonly ICustomerRepository _customerRepository;

        public AuthController(IAccountRepository accountRepository, IMemoryCacheService memoryCacheService, ICustomerRepository customerRepository)
        {
            _accountRepository = accountRepository;
            _memoryCacheService = memoryCacheService;
            _customerRepository = customerRepository;
        }

        public bool IsValidPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                return false;

            string pattern = @"^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]).{8,}$";
            return Regex.IsMatch(password, pattern);
        }
        public async Task<IActionResult> LogIn()
        {
            //if (User.Identity?.IsAuthenticated == true)
            //{
            //    var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value ?? "User";

            //    if (role.Equals("C", StringComparison.OrdinalIgnoreCase))
            //    {
            //        return RedirectToAction("Index", "Customer");
            //    }

            //}

            if (Request.Cookies.TryGetValue("LogoutMessage", out var message))
            {
                ViewData["LoginErrorMessage"] = message;

                Response.Cookies.Delete("LogoutMessage");
            }

            //try
            //{
            //    var companies = await _customerRepository.GetCompany();
            //    ViewBag.Companies = companies;
            //}
            //catch (Exception ex)
            //{
            //    ViewBag.Companies = null;
            //}

            return View(new UserLogin());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> LogIn(UserLogin userLogin)
        {
            try
            {
                if (!ModelState.IsValid)
                {

                    ViewData["LoginErrorMessage"] = "Invalid input.";
                    return View(userLogin);
                }

                //var kk = PasswordConfig.GetMd5Hash(userLogin.Password);
                LoginRequest loginRequest = new LoginRequest()
                {
                    MobileOrEmail = userLogin.EmpCode,
                    CompanyCode = 0,
                    UserId = string.Empty,
                    Password = userLogin.Password,
                    IsJwtToken = true,
                    IsResendCode = 0,
                    IsLoginWithOtp = false
                };

                LoginStatus loginStatus = await _accountRepository.LoginUser(loginRequest);

                if (loginStatus.Success)
                {


                    string role = loginStatus.Role;

                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, loginStatus.UserId.ToString()),

                        new Claim(ClaimTypes.Role, role),
                        new Claim("CustomerType", role),
                        new Claim("UserId", loginStatus.UserId),
                        new Claim("UserName", loginStatus.UserName),
                        //new Claim("CompanyName", loginStatus.CompanyName),
                        new Claim("EmpId", loginStatus.EmpId),
                        //new Claim("CompanyCode", userLogin.CompanyCode.ToString())

                    };


                    //if (loginStatus.PasswordState == PasswordStatus.AboutToExpire)
                    //{
                    //    TempData["PwExipreAlert"] = loginStatus.Message;
                    //}
                    var identity = new ClaimsIdentity(claims, "CookieAuth");
                    var principal = new ClaimsPrincipal(identity);

                    // Sign in user with cookie
                    await HttpContext.SignInAsync("CookieAuth", principal, new AuthenticationProperties
                    {
                        IsPersistent = false
                    });

                    var tokenCookieOptions = new CookieOptions()
                    {
                        HttpOnly = true,
                        //Secure = true,
                        //SameSite = SameSiteMode.Strict,
                        Expires = DateTimeOffset.UtcNow.AddHours(4)
                    };

                    //HttpContext.Session.SetString("UserName", loginStatus.UserName);
                    // HttpContext.Session.SetString("CompanyName", loginStatus.CompanyName);
                   
                   
                    HttpContext.Response.Cookies.Append($"t_{loginStatus.EmpId}", EncDecHelper.Encrypt(loginStatus.Token), tokenCookieOptions);
                    // TODO - Change token handling (do not store in the session)
                    //HttpContext.Session.SetString("user_token", loginStatus.Token);
                    //HttpContext.Session.SetInt32("userId", loginStatus.UserId);
                    if (loginStatus.RespCode == 201)
                    {
                        return RedirectToAction("ChangePassword", "Auth");
                    }
                    else
                    {


                        switch (role)
                        {
                            case "ADMIN":
                                // Code block
                                return RedirectToAction("Dashboard", "Admin");
                            //break;

                            case "USER":
                                // Code block
                                return RedirectToAction("MyPunchingReport", "Report");
                            case "HOD":
                                // Code block
                                return RedirectToAction("MyPunchingReport", "Report");
                            case "INCHARGE":
                                // Code block
                                return RedirectToAction("MyPunchingReport", "Report");
                            default:
                                // Code block
                                return RedirectToAction("LoginAdmin", "Auth");
                        }
                    }
                    //return role.Equals("C", StringComparison.InvariantCultureIgnoreCase) ? RedirectToAction("Index", "Customer") : RedirectToAction("Dashboard", role, new { area = role });
                }
                else
                {

                    ViewData["LoginErrorMessage"] = "Bad Credentials!";
                    return View(userLogin);
                }
            }
            catch (Exception ex)
            {

                ViewData["LoginErrorMessage"] = "Something went wrong!";
                return View(userLogin);
            }

        }
        //public async Task<IActionResult> ResetPassword()
        //{

        //    return View();

        //}
        public async Task<IActionResult> ResetPassword(string? authResetToken)
        {
            if (string.IsNullOrEmpty(authResetToken))
            {
                TempData["ForgotPasswordRequestError"] = "Reset Password Url Is Invalid/Expired";
                RedirectToAction("Login");
            }


            (bool isRequestValid, string userId) = await _accountRepository.ResetPasswordUrlValidate(authResetToken);

            if (isRequestValid && !string.IsNullOrEmpty(userId))
            {
                return View(new ResetPasswordViewModel { UserId = EncDecHelper.Encrypt(userId) });
            }

            //toast message on login page
            TempData["ForgotPasswordRequestError"] = "Reset Password Url Is Invalid/Expired";
            return RedirectToAction("Login");
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel resetUserPasswordData)
        {
            if (!ModelState.IsValid)
            {
                // Validation failed – return view with errors
                return View(resetUserPasswordData);
            }
            resetUserPasswordData.UserId = EncDecHelper.Decrypt(resetUserPasswordData.UserId);
            bool isResetSuccess = await _accountRepository.ResetPassword(resetUserPasswordData.UserId, resetUserPasswordData.Password);
            if (isResetSuccess)
            {
                TempData["ResetPasswordSuccessMessage"] = "Password updated Successfully!";
                return RedirectToAction("Login");
            }


            TempData["ResetPasswordErrorMessage"] = "Failed to reset password!";
            return RedirectToAction("Login");
        }
        public IActionResult ForgotPassword()
        {
            return View();
        }
        public IActionResult ChangePassword()
        {
            ViewBag.ErCode = TempData["CPasswordCode"] as string;
            ViewBag.ErMsg = TempData["CPasswordMsg"] as string;
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> UpdatePassword(string userId, string password)
        {
            if (string.IsNullOrEmpty(password) || !IsValidPassword(password))
            {
                TempData["CPasswordCode"] = "0";
                TempData["CPasswordMsg"] = "Invalid Password";
                return RedirectToAction("ChangePassword");
                //return new JsonResult(new { code = -1, message = "Invalid Password. Password must be at least 8 characters long and contain at least one letter, one number, and one special character." });
            }
            bool res = await _accountRepository.UpdatePassword(userId, password);
            if (res)
            {
                TempData["CPasswordCode"] = "1";
                TempData["CPasswordMsg"] = "Password updated Successfully!";
            }
            else
            {
                TempData["CPasswordCode"] = "0";
                TempData["CPasswordMsg"] = "Password update failed";
            }


            return RedirectToAction("ChangePassword");
        }

        [HttpPost]
        public async Task<JsonResult> ForgotPassword(string email)
        {
            if (string.IsNullOrEmpty(email.Trim()))
            {
                return new JsonResult(new { Status = -400 });
            }

            EmailStatus emailSentStatus = await _accountRepository.SendForgotPasswordEmail(email);

            
            return new JsonResult(emailSentStatus);
        }
      

        public async Task<IActionResult> Logout()
        {
            string empId = HttpContext.User.FindFirst("EmpId")?.Value;
           
            HttpContext.Session.Clear();
            Response.Cookies.Delete($"t_{empId}");
            await HttpContext.SignOutAsync("CookieAuth");
            return RedirectToAction("Index", "Home");

        }

        public async Task<IActionResult> AccessDenied()
        {
            return View();
        }

    }
}
