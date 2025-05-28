using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.DTOs.ResponseModels
{
    public class UserInfo
    {
        public string UserId { get; set; } = "0";
        public string UserName { get; set; } = string.Empty;
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserType { get; set; } = string.Empty;
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string FilePath { get; set; }
        public string DOB { get; set; }
        public string LastLoginDate { get; set; } = string.Empty;
        public string UserStatus { get; set; } = string.Empty;
    }
}
