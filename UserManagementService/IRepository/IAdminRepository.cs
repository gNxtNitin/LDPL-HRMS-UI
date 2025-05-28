using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.DTOs.RequestModels;
using UserManagementService.DTOs.ResponseModels;
using UserManagementService.Models;

namespace UserManagementService.IRepository
{
    public interface IAdminRepository
    {
        Task<List<UserInfo>> GetAllUsers();

        Task<bool> AddUpdateUser(UserInfo userRequest);

        Task<bool> DeleteUser(UserInfo userRequest);
        Task<bool> UpdateUserRoleById(string userId, string roleId);

       

        Task<bool> UpdatePasswordPolicy(PasswordPolicyValidatonRule passwordPolicy);


        Task<List<RoleResponse>> GetRolesWithUsers();
        Task<bool> CreateRole(RoleMasterReqModel rm);
        Task<bool> UpdateRole(RoleMasterReqModel rm);
        Task<bool> DeleteRole(RoleMasterReqModel rm);

        Task<List<RoleMenuAccess>> GetMenuByRole(int roleId);


    }
}
