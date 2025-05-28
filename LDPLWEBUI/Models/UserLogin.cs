using System.ComponentModel.DataAnnotations;

namespace LDPLWEBUI.Models
{
    public class UserLogin
    {
        [Required]
        public string EmpCode { get; set; }

        [Required]
        public string Password { get; set; }
        [Required]
        public int CompanyCode { get; set; }

        public string CaptchaKey { get; set; } = string.Empty;

        public bool IsRememberMe { get; set; }
    }
}
