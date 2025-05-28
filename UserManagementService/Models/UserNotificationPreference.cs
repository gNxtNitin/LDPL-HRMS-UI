using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class NotificationPreference
    {
        public int NPID { get; set; } = 0;
        public string Preference { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string? CreatedBy { get; set; } = "0";
        public string? ModifiedBy { get; set; } = "0";
        public DateTime? ModifiedDate { get; set; } = DateTime.Now;
    }

    public class UserNotificationPreference
    {
        public int UNPID { get; set; } = 0;
        public int NPID { get; set; }
        public int UserId { get; set; }
        public int? CreatedBy { get; set; } = 0;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? ModifiedBy { get; set; } = 0;
        public DateTime? ModifiedDate { get; set; } = DateTime.Now;
        public NotificationPreference Preference { get; set; }
    }

    

}
