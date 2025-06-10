import { League, Season, ApiResult } from '../../types/api';

export const mockLeagues: League[] = [
  {
    idLeague: '4328',
    strLeague: 'English Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'Premier League',
    strCurrentSeason: '2023-2024',
    strDivision: null,
    strCountry: 'England',
    strWebsite: null,
    strFacebook: null,
    strTwitter: null,
    strYoutube: null,
    strDescriptionEN: null,
  },
  {
    idLeague: '4329',
    strLeague: 'NBA',
    strSport: 'Basketball',
    strLeagueAlternate: 'National Basketball Association',
    strCurrentSeason: '2023-2024',
    strDivision: null,
    strCountry: 'United States',
    strWebsite: null,
    strFacebook: null,
    strTwitter: null,
    strYoutube: null,
    strDescriptionEN: null,
  },
];

export const mockSeasons: Season[] = [
  {
    idSeason: '2023',
    strSeason: '2023-2024',
    strLeague: 'English Premier League',
    strDivision: null,
  },
  {
    idSeason: '2022',
    strSeason: '2022-2023',
    strLeague: 'English Premier League',
    strDivision: null,
  },
];

const successResponse = <T>(data: T): ApiResult<T> => ({
  data,
  error: null,
});

export const fetchLeagues = jest.fn().mockResolvedValue(successResponse(mockLeagues));
export const fetchSeasons = jest.fn().mockResolvedValue(successResponse(mockSeasons));
export const fetchLeaguesBySearch = jest.fn().mockResolvedValue(successResponse(mockLeagues)); 