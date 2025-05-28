using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.DTOs.RequestModels
{
    public class AssignRoleReqest
    {
        public string UserId { get; set; }
        public string RoleId { get; set; }
        
    }
}
