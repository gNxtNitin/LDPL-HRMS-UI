using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LDPLWEBUI.Models
{
    public class SchoolViewModel
    {
        [Required(ErrorMessage = "Action is required.")]
        public string flag { get; set; } = "G";
        [JsonPropertyName("school_code")]
        [Required(ErrorMessage = "School code is required.")]
        public string SchoolCode { get; set; }

        [JsonPropertyName("school_name")]
        [Required(ErrorMessage = "School name is required.")]
        public string SchoolName { get; set; }

        [JsonPropertyName("ename")]
        [Required(ErrorMessage = "Employee name is required.")]
        public string EName { get; set; }

        [JsonPropertyName("empid")]
        [Required(ErrorMessage = "Employee ID is required.")]
        public string EmpId { get; set; }

        [JsonPropertyName("saddress")]
        [Required(ErrorMessage = "School address is required.")]
        public string SAddress { get; set; }

        [JsonPropertyName("city")]
        [Required(ErrorMessage = "City is required.")]
        public string City { get; set; }

        [JsonPropertyName("state")]
        [Required(ErrorMessage = "State is required.")]
        public string State { get; set; }

        [JsonPropertyName("school_category")]
        [Required(ErrorMessage = "School category is required.")]
        public string SchoolCategory { get; set; }

        [JsonPropertyName("vendor_type")]
        [Required(ErrorMessage = "Vendor type is required.")]
        public string VendorType { get; set; }

        [JsonPropertyName("account_manager")]
        public string? AccountManager { get; set; }

        [JsonPropertyName("incharge")]
        [Required(ErrorMessage = "Incharge is required.")]
        public string Incharge { get; set; }
    }
}
