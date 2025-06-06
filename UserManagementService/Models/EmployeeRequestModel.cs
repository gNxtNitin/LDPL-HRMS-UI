using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace UserManagementService.Models
{
    public class EmployeeRequestModel
    {
        public string? flag { get; set; } = "G";
        public decimal? Id { get; set; }
        [JsonPropertyName("user_role_id")]
        public string UserRoleId { get; set; }

        public string EmpId { get; set; }

        public string EName { get; set; }

        public string Email { get; set; }

        public string EFName { get; set; }

        public string Password { get; set; }

        public string Designation { get; set; }

        public string Department { get; set; }

        public string Gender { get; set; }

        public string Mobile { get; set; }

        public string Address { get; set; }

        public string LogDate { get; set; }


        [JsonPropertyName("account_manager")]
        public string AccountManager { get; set; }
        [JsonPropertyName("departmentid")]
        public string DepartmentId { get; set; }
        [JsonPropertyName("rolename")]
        public string RoleName { get; set; }
        [JsonPropertyName("accountmanagerid")]
        public string AccountManagerId { get; set; }

        //public bool IsActive { get; set; }

        //public int? DepartmentId { get; set; }

    }
}
