using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.Models;

namespace UserManagementService.IRepository
{
    public interface IConfigurationRepository
    {
        Task<PasswordPolicyMaster> GetPasswordPolicy();
        Task<bool> UpdatePasswordPolicy(PasswordPolicyMaster passwordPolicy);
    }
}
