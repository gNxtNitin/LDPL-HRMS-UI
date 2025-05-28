using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{
    public class OTPValidateStatus
    {
        public bool IsValidated {  get; set; }

        public bool IsRequestValid { get; set; }

        public bool IsToken { get; set; }

        public string Token { get; set; }   = string.Empty;
    }
}
