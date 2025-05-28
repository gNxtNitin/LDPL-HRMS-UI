using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class DAUploadModel
    {
        public string EmpId { get; set; }
        public decimal DA { get; set; }
        public decimal? Hotel { get; set; }
        public decimal? Other { get; set; }
        public float KM { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public List<IFormFile>? Bills { get; set; }
        public List<string>? Descriptions { get; set; }
    }

}
