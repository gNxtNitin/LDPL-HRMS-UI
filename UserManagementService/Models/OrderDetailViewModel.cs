using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace UserManagementService.Models
{
    public class OrderDetailViewModel
    {
        public string? CompanyCode { get; set; }
        public int? AutoKeyOrder { get; set; }
        public string? OrderDate { get; set; }
        public string? SuppCustCode { get; set; }
        public string? AttachFile { get; set; }
        public string? ContentType { get; set; }
        public string? FileName { get; set; }
        public string? ShipToParty { get; set; }
        public string? ShipToAddress { get; set; }
        public string? TransporterName { get; set; }
        public string? BookingStation { get; set; }
        public string? CustomerPoNo { get; set; }
        public string? SchoolName { get; set; }
        public List<OrderItemViewModel> Items { get; set; }
    }
}
