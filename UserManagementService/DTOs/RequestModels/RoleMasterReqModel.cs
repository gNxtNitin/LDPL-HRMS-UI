using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.DTOs.RequestModels
{
    public class RoleMasterReqModel
    {
        public string RoleId { get; set; }
        public string? RoleName { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; } = 0;
    }
}
