using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Models
{


    public class AuthOptions
    {
        public bool LoginWithEmail { get; set; } = true;
        public bool LoginWithPhone { get; set; } = true;
        public bool OTPRequired { get; set; } = true;
    }
}
