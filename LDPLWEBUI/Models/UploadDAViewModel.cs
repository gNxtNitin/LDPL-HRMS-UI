using System.ComponentModel.DataAnnotations;

namespace LDPLWEBUI.Models
{
    public class UploadDAViewModel
    {
        public string? EmpId { get; set; }

        
        public string? EmployeeName { get; set; }

       
        public string? Department {  get; set; }

      
        public string? Manager { get; set; }

       
        public string? Role { get; set; }

        [Required(ErrorMessage = "Please Enter DA Amount")]
        public decimal DA { get; set; } = 0;

        public float KM { get; set; } = 0;

        public decimal? Hotel { get; set; } = 0;
        public decimal? Other { get; set; } = 0;
       
        [Required(ErrorMessage = "Please Select From Date")]
        public string FromDate { get; set; }

        [Required(ErrorMessage = "Please Select To Date")]
        public string ToDate { get; set; }

        public List<IFormFile>? Bills { get; set; }

        public List<string>? Descriptions { get; set; }
    }
}
