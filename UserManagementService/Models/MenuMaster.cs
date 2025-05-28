using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class MenuMaster
    {
        public string MenuId { get; set; }
        public string? ParentId { get; set; }
        public string? MenuName { get; set; }
        public string? Areas { get; set; }
        public string? ControllerName { get; set; }
        public string? ActionName { get; set; }
        public string? Url { get; set; }
        public int Order { get; set; }
        public string IsActive { get; set; }
        public string? IconClass { get; set; }
    }
}
