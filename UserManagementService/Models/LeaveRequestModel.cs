using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class LeaveRequestModel
    {
        public string? flag {  get; set; }
        [JsonPropertyName("AUTO_KEY_REF")]
        public decimal? AutoKeyRef { get; set; }

        [JsonPropertyName("REF_DATE")]
        public string? RefDate { get; set; }

        [JsonPropertyName("COMPANY_CODE")]
        public decimal? CompanyCode { get; set; }

        [JsonPropertyName("EMP_CODE")]
        public string? EmpCode { get; set; }

        [JsonPropertyName("FROM_DATE")]
        public string? FromDate { get; set; }

        [JsonPropertyName("TO_DATE")]
        public string? ToDate { get; set; }

        [JsonPropertyName("LDAYS")]
        public decimal? Ldays { get; set; } = 0;

        

        [JsonPropertyName("REASON")]
        public string? Reason { get; set; }

        [JsonPropertyName("APP_STATUS")]
        public string? AppStatus { get; set; } = "O";

        [JsonPropertyName("HR_STATUS")]
        public string? HrStatus { get; set; } = "O";

        [JsonPropertyName("HALF_DAY")]
        public string HalfDay { get; set; } = "0";
        [JsonPropertyName("STATUS")]
        public bool? Status { get; set; } = false;
    }
}
