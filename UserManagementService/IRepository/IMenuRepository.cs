using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementService.DTOs.ResponseModels;
using UserManagementService.Models;

namespace UserManagementService.IRepository
{
    public interface IMenuRepository
    {
        Task<List<MenuMaster>> GetMenuByUserId(string userId);

        Task<List<MenuFeatures>> GetUserMenuFeatures(int userId, int menuId);

        Task<List<MenuMaster>> GetMenuMaster();

        Task<List<FeatureMaster>> GetMenuFeatureMaster();

        
      
    }
}
