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
    public interface IUserRepository
    {
     
        Task<bool> UpdateUserProfile(AddUpdateUserRequest userUpdateRequest);
        Task<AddUpdateUserRequest> GetUserProfile(string userId);
        Task<bool> DeleteUser(string UserId);

        Task<List<UserNotificationPreference>> GetUserNotificationPreferences(string userId);

        Task<bool> UpdateUserNotificationPreference(int userId, int userNPID, bool isCreate);
        Task<bool> CreateUpdateDeleteSchool(SchoolRequestModel srm);
        Task<List<SchoolRequestModel>> GetAllSchool(string empid);

    }
}
