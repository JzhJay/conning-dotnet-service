using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Conning.GraphQL
{
    /*
     * To manage the status of cache usages in application
     */
    public static class OmdbCacheKeys
    {
        public static string RunQuery { get { return "Omdb_RunQuery";} } 
        public static string GetDistinctTagValues { get { return "omdb_getDistinctTagValues";} } 
        public static string Ui { get { return "omdb_ui";} }
        public static string FindOneAsyncDynamic { get { return "FindOneAsync_dynamic"; } }
    }

    public class OmdbCache
    {
        private readonly IMemoryCache _cache;
        private Dictionary<string, ConcurrentDictionary<string, byte>> _cacheKeys = new Dictionary<string, ConcurrentDictionary<string, byte>>();
        private OmdbService _omdb;

        public OmdbCache(OmdbService omdb, IMemoryCache cache)
        {
            _omdb = omdb;
            _cache = cache;
        }
        
        public void AddCacheKeyByTenant(string tenant, string cacheKey)
        {
            if (!_cacheKeys.ContainsKey(tenant))
            {
                _cacheKeys[tenant] = new ConcurrentDictionary<string, byte>();
            }

            _cacheKeys[tenant].TryAdd(cacheKey, 0);
        }
        
        public async Task<TItem> GetValue<TItem>(string cacheKey, Func<ICacheEntry, Task<TItem>> factory)
        {
            return await _cache.GetOrCreateAsync(cacheKey, async entry =>
            {
                AddCacheKeyByTenant(_omdb.MongoService.getCurrentTenant(), cacheKey);
                return await factory(entry);
            });
        }

        public void ResetCacheByTenant(string tenant)
        {
            var log = this._omdb.log;    
            log.LogInformation($"Reset Omdb Cache, tenant {tenant}");
            if (_cacheKeys.TryGetValue(tenant, out var keys))
            {
                foreach (var cacheKey in keys.Keys)
                {
                    log.LogInformation($"Remove cached item with key: [{cacheKey}] in memory");
                    _cache.Remove(cacheKey);
                }
                log.LogInformation($"Remove cached items, Count: [{keys.Count}]");
            }
            
            _cacheKeys.Remove(tenant);
        }

        public void ResetCacheKeyByTenant(string tenant, string matchKey)
        {
            this._omdb.log.LogInformation($"Reset Omdb Cache, tenant {tenant}, key: {matchKey}");
            if (_cacheKeys.ContainsKey(tenant))
            {
                ConcurrentDictionary<string, byte> tenantCachedDict = _cacheKeys[tenant];
                List<string> keys = tenantCachedDict.Keys.ToList<string>();

                keys.ForEach((key) =>
                {
                    if (key.Contains(matchKey))
                    {
                        _cache.Remove(key);
                        tenantCachedDict.Remove(key, out byte result);
                    }
                });
            }
        }
    }
}