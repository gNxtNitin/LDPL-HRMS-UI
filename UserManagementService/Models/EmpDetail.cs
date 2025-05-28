using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class EmpDetail
    {
        public string EmpId { get; set; }
        public string Name { get; set; }
        public string Department { get; set; }
      
        public string Manager { get; set; }
        public string Role { get; set; }

    }
}
