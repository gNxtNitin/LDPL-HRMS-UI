using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.DTOs.RequestModels
{
    public class LoginRequest
    {
        public string? MobileOrEmail { get; set; }
        public bool IsLoginWithOtp { get; set; }
        public int CompanyCode { get; set; }
        public string? Password { get; set; }
        public string? VerificationCode { get; set; }
        public string UserId { get; set; }
        public int? IsResendCode { get; set; } = 0;
        public bool IsJwtToken { get; set; }
    }
}
