using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public enum PasswordStatus
    {
        Valid,
        Expired,
        AboutToExpire

    }

    public class LoginStatus
    {
        public int? RespCode { get; set; } = 0;
        public bool Success { get; set; }

        public string Message { get; set; } = string.Empty;

        public bool IsOtpRequired { get; set; }

        public string UniqueId { get; set; } = string.Empty;
        public string? CompanyName { get; set; } = string.Empty;
        public string? EmpId { get; set; } = string.Empty;
        public string? Role { get; set; } = string.Empty;

        public string? UserName { get; set; } = string.Empty;

        public string UserId { get; set; } = "0";

        public string Token { get; set; } = string.Empty;

        public PasswordStatus PasswordState { get; set; }
    }
}
