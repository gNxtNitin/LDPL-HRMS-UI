using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class UserDetailsModel
    {
        [JsonPropertyName("ID")]
        public double ID { get; set; }

        [JsonPropertyName("USER_ROLE_ID")]
        public string UserRoleId { get; set; }

        [JsonPropertyName("EMPID")]
        public string EmpId { get; set; }

        [JsonPropertyName("ENAME")]
        public string EName { get; set; }

        [JsonPropertyName("EMAIL")]
        public string Email { get; set; }

        [JsonPropertyName("EFNAME")]
        public string EFName { get; set; }

        [JsonPropertyName("PASSWORD")]
        public string Password { get; set; }

        [JsonPropertyName("DESIGNATION")]
        public string Designation { get; set; }

        [JsonPropertyName("DEPARTMENT")]
        public string Department { get; set; }

        [JsonPropertyName("GENDER")]
        public string Gender { get; set; }

        [JsonPropertyName("MOBILE")]
        public string Mobile { get; set; }

        [JsonPropertyName("ADDRESS")]
        public string Address { get; set; }

        [JsonPropertyName("LOGDATE")]
        public DateTime LogDate { get; set; }

        [JsonPropertyName("PHOTO")]
        public string? Photo { get; set; }

        [JsonPropertyName("ACCOUNT_MANAGER")]
        public string? AccountManager { get; set; }
    }
}
