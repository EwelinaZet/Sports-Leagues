export const CACHE_KEYS = {
  ALL_LEAGUES: 'all_leagues',
  SEASONS: 'seasons',
};

export const useApiCache = () => ({
  getFromCache: jest.fn(),
  setToCache: jest.fn(),
  clearCache: jest.fn(),
}); 