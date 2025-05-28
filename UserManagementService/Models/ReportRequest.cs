using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class ReportRequest
    {
        public string EmpId { get; set; }
        public DateTime DTRangeFrom { get; set; }
        public DateTime DTRangeTo { get; set; }
        public bool IsTeamData { get; set; }
    }
}
