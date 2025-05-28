using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UserManagementService.Utility
{
    public interface IMemoryCacheService
    {
        void Set(string key, string value, TimeSpan expiration);
        string Get(string key);
        void Remove(string key);

        void SetUserToken(string userId, string token);
    }
}
