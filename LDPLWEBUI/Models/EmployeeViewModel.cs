using System.Text.Json.Serialization;

namespace LDPLWEBUI.Models
{
    public class EmployeeViewModel
    {
        public string? flag { get; set; } = "G";
        // public decimal? Id { get; set; }

        public string UserRoleId { get; set; }

        public string EmpId { get; set; }

        public string EName { get; set; }

        public string? Email { get; set; }

        public string? EFName { get; set; }

        public string? Password { get; set; }

        public string? Designation { get; set; }

        public string? Department { get; set; }

        public string? Gender { get; set; }

        public string? Mobile { get; set; }

        public string? Address { get; set; }

        // public string LogDate { get; set; }

        //public string? Photo { get; set; }

        public string? AccountManager { get; set; }

    }
}
