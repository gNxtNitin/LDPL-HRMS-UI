using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class OTPSentStatus
    {
        public bool IsSent { get; set; }
        public bool RetryLimitReached { get; set; }
        public bool IsRequestValid { get; set; }
    }
}
