using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class CityRequestModel
    {
        [JsonPropertyName("flag")]
        public string? flag { get; set; } = "G";
        [JsonPropertyName("cname")]
        public string? cname { get; set; } = "string.Empty";
        [JsonPropertyName("sname")]
        public string? sname { get; set; } = "string.Empty";
        [JsonPropertyName("cityid")]
        public decimal? CityId { get; set; }
        [JsonPropertyName("logdate")]
        public string? LogDate { get; set; }
    }
}
