using Microsoft.Extensions.Caching.Memory;

namespace UserManagementService.Utility
{
    public class MemoryCacheService:IMemoryCacheService
    {
        private readonly IMemoryCache _cache;
        public MemoryCacheService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public void Set(string key, string value, TimeSpan expiration)
        {
            _cache.Set(key, value, expiration);
        }

        public string Get(string key)
        {
            return _cache.TryGetValue(key, out string value) ? value : default;
        }

        public void Remove(string key)
        {
            _cache.Remove(key);
        }

        public void SetUserToken(string userId, string token)
        {
            var cacheEntryOptions = new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(30),
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(2)
            };

            _cache.Set(userId, token, cacheEntryOptions);
            
        }
    }
}
