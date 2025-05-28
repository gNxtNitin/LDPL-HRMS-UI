using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class MenuFeatures
    {
        public int MenuId { get; set; }
        public int FeatureId { get; set; }
        public string MenuName { get; set; }
        public string FeatureName { get; set; }
        public string FeatureCode { get; set; }
    }
}
