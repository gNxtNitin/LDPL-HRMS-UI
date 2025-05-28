using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class SchoolRequestModel
    {
        public string? flag { get; set; } = "G";
        [JsonPropertyName("school_code")]
        public string SchoolCode { get; set; }

        [JsonPropertyName("school_name")]
        public string SchoolName { get; set; }

        [JsonPropertyName("ename")]
        public string EName { get; set; }

        [JsonPropertyName("empid")]
        public string EmpId { get; set; }

        [JsonPropertyName("saddress")]
        public string SAddress { get; set; }

        [JsonPropertyName("city")]
        public string City { get; set; }

        // SADDRESS was repeated; assuming only one property needed.
        // Removed duplicate.

        [JsonPropertyName("state")]
        public string State { get; set; }

        [JsonPropertyName("school_category")]
        public string SchoolCategory { get; set; }

        [JsonPropertyName("vendor_type")]
        public string VendorType { get; set; }

        [JsonPropertyName("account_manager")]
        public string AccountManager { get; set; }

        [JsonPropertyName("incharge")]
        public string Incharge { get; set; }
        [JsonPropertyName("logdate")]
        public string? LogDate { get; set; }
        [JsonPropertyName("role")]
        public string? Role { get; set; }
        [JsonPropertyName("department")]
        public string? Department { get; set; }
        [JsonPropertyName("statecode")]
        public decimal? StateCode { get; set; }
        [JsonPropertyName("citycode")]
        public decimal? CityCode { get; set; }

    }
}
