interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useApiCache = () => {
  const getFromCache = <T>(key: string): T | null => {
    try {
      const cachedData = localStorage.getItem(key);
      if (!cachedData) return null;

      const { data, timestamp }: CacheItem<T> = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > CACHE_EXPIRATION;

      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  };

  const setToCache = <T>(key: string, data: T): void => {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  };

  const clearCache = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return {
    getFromCache,
    setToCache,
    clearCache,
  };
};

export const CACHE_KEYS = {
  ALL_LEAGUES: 'sports_leagues_cache',
  SEASONS: 'sports_seasons_cache',
  LEAGUE_DETAILS: 'league_details_cache'
} as const; 