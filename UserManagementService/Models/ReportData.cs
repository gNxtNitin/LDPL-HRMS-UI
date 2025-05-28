using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class EmpDAReport
    {
        public string DAID { get; set; }
        public string EMPID { get; set; }
        public string ENAME { get; set; }
        public double DA { get; set; }
        public double HOTEL { get; set; }
        public double OTHER { get; set; }
        public double KM { get; set; }
        public DateTime FROMDATE { get; set; }
        public DateTime TODATE { get; set; }
        public string DASTATUS { get; set; }
        public DateTime ADDDATETIME { get; set; }
        public string BILLS { get; set; }
    }

    public class EmpEpunchReport
    {
        public string EmpId { get; set; }
        public string EName { get; set; }
        public string Zone { get; set; }
        public string Gloc { get; set; }
        public string EPhoto { get; set; }
        public DateTime PunchDateTime { get; set; }
        public double Km { get; set; }
        public string Address { get; set; }
        public string Location { get; set; }
    }
}
