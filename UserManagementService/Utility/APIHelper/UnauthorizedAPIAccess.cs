using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Utility.APIHelper
{
    public class UnauthorizedApiException : Exception
    {
        public UnauthorizedApiException(string message) : base(message) { }
    }

}
