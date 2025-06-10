import { League, Season, SeasonBadge, ApiResult } from '../types/api';
import { apiRequest, retryApiRequest } from '../utils/api';

export const ENDPOINTS = {
  ALL_LEAGUES: '/all_leagues.php',
  SEASONS: '/search_all_seasons.php',
  SEASON_BADGE: '/search_all_seasons.php',
} as const;

export const fetchLeagues = async (): Promise<ApiResult<League[]>> => {
  return retryApiRequest<League>(ENDPOINTS.ALL_LEAGUES);
};

export const fetchSeasons = async (leagueId: string): Promise<ApiResult<Season[]>> => {
  return apiRequest<Season>(ENDPOINTS.SEASONS, { id: leagueId });
};

export const fetchSeasonBadge = async (leagueId: string): Promise<ApiResult<SeasonBadge[]>> => {
  return apiRequest<SeasonBadge>(ENDPOINTS.SEASON_BADGE, { 
    id: leagueId,
    badge: '1'
  });
};

export const fetchLeagueDetails = async (leagueId: string): Promise<ApiResult<League[]>> => {
  const result = await apiRequest<League>('/lookupleague.php', { id: leagueId });
  
  if (result.error) {
    // If the first attempt fails, try with retries
    return retryApiRequest<League>('/lookupleague.php', { id: leagueId });
  }
  
  return result;
};

// Helper function to extract badge URL from API result
export const extractBadgeUrl = (result: ApiResult<SeasonBadge[]>): string | null => {
  if (result.error || !result.data || result.data.length === 0) {
    return null;
  }
  return result.data[0]?.strBadge || null;
};

// Helper function to handle API errors
export const handleApiError = (error: ApiResult<unknown>['error']): string => {
  if (!error) return 'An unknown error occurred';

  switch (error.code) {
    case 404:
      return 'The requested resource was not found';
    case 429:
      return 'Too many requests. Please try again later';
    case 500:
      return 'Server error. Please try again later';
    default:
      return error.message || 'An unknown error occurred';
  }
}; 