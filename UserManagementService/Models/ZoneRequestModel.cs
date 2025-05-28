using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class ZoneRequestModel
    {
        [JsonPropertyName("flag")]
        public string? flag { get; set; } = "G";
        [JsonPropertyName("name")]
        public string? name { get; set; } = string.Empty;
        [JsonPropertyName("zoneid")]
        public decimal? ZoneId { get; set; }
        [JsonPropertyName("logdate")]
        public string? LogDate { get; set; }
    }
}
