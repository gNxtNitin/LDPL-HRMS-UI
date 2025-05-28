using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class OrderDetailsModel
    {
        [JsonPropertyName("auto_key_order")]
        public int? AutoKeyOrder { get; set; }

        [JsonPropertyName("order_date")]
        public string? OrderDate { get; set; }

        [JsonPropertyName("item_code")]
        public string? ItemCode { get; set; }

        [JsonPropertyName("item_short_desc")]
        public string? ItemShortDesc { get; set; }

        [JsonPropertyName("item_uom")]
        public string? ItemUOM { get; set; }

        [JsonPropertyName("item_qty")]
        public decimal? ItemQty { get; set; }

        [JsonPropertyName("item_price")]
        public decimal? ItemPrice { get; set; }

        [JsonPropertyName("item_disc")]
        public decimal? ItemDisc { get; set; }

        [JsonPropertyName("item_amount")]
        public decimal? ItemAmount { get; set; }

        [JsonPropertyName("ship_to_party")]
        public string? ShipToParty { get; set; }

        [JsonPropertyName("ship_to_address")]
        public string? ShipToAddress { get; set; }

        [JsonPropertyName("transporter_name")]
        public string? TransporterName { get; set; }

        [JsonPropertyName("booking_station")]
        public string? BookingStation { get; set; }

        [JsonPropertyName("customer_po_no")]
        public string? CustomerPONo { get; set; }

        [JsonPropertyName("school_name")]
        public string? SchoolName { get; set; }

        [JsonPropertyName("status")]
        public string? Status { get; set; }

        [JsonPropertyName("pending_items")]
        public decimal? PendingItems { get; set; }

        [JsonPropertyName("approved_items")]
        public decimal? ApprovedItems { get; set; }

        [JsonPropertyName("executed_items")]
        public decimal? ExecutedItems { get; set; }

        [JsonPropertyName("invoices")]
        public decimal? Invoices { get; set; }
    }
}
