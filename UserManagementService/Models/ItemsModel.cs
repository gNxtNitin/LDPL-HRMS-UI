using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class ItemsModel
    {
        [JsonPropertyName("item_code")]
        public string ItemCode { get; set; }

        [JsonPropertyName("item_short_desc")]
        public string ItemShortDesc { get; set; }

        [JsonPropertyName("issue_uom")]
        public string IssueUOM { get; set; }

        [JsonPropertyName("rate")]
        public decimal Rate { get; set; }

        [JsonPropertyName("qty")]
        public decimal Qty { get; set; }
        [JsonPropertyName("gen_desc")]
        public string? Category { get; set; }
        [JsonPropertyName("subcategory_desc")]
        public string? Subcategory { get; set; }
        [JsonPropertyName("prodtype_desc")]
        public string? ProdTypedesc { get; set; }
        [JsonPropertyName("subcategory_code")]
        public string? SubCode { get; set; }

    }
}
