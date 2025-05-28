using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class FeatureMaster
    {
        public int FeatureId { get; set; }
        public string FeatureName { get; set; }
        public string FeatureCode { get; set; }
        public string? FeatureDescription { get; set; }
        public int CreatedBy { get; set; } = 0;
        public int? ModifiedBy { get; set; }
    }
}
