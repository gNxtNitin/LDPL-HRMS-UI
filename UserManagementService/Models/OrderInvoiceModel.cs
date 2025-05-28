using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class OrderInvoiceModel
    {

        [JsonPropertyName("mkey")]
        public string? Mkey { get; set; }

        [JsonPropertyName("billno")]
        public string? BILLNO { get; set; }

        [JsonPropertyName("supp_cust_code")]
        public string? CustomerCode { get; set; }

        [JsonPropertyName("invoice_date")]
        public string? InvoiceDate { get; set; }

        [JsonPropertyName("inv_amt")]
        public decimal? InvoiceAmount { get; set; }

        [JsonPropertyName("auto_key_desp")]
        public decimal? DespatchNumber { get; set; }
        [JsonPropertyName("grnumber")]
        public decimal? GRNumber { get; set; }
        [JsonPropertyName("fyear")]
        public string? FYear { get; set; }
        [JsonPropertyName("adduser")]
        public string? AddUser { get; set; }
        [JsonPropertyName("company_code")]
        public decimal? CompanyCode { get; set; }

    }
}
