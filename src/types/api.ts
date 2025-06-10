export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string | null;
  strDivision: string | null;
  strCurrentSeason: string | null;
  strCountry: string | null;
  strWebsite: string | null;
  strFacebook: string | null;
  strTwitter: string | null;
  strYoutube: string | null;
  strDescriptionEN: string | null;
}

export interface Season {
  idSeason: string;
  strSeason: string;
  strLeague: string;
  strDivision: string | null;
}

export interface SeasonBadge {
  idSeason: string;
  strSeason: string;
  strLeague: string;
  strBadge: string | null;
}

export interface ApiResponse<T> {
  leagues?: T[];
  seasons?: T[];
  error?: {
    message: string;
    code: number;
  };
}

export interface ApiError {
  message: string;
  code: number;
  endpoint: string;
}

export type ApiResult<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: ApiError;
}; 