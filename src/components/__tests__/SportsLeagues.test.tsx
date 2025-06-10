import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import SportsLeagues from '../SportsLeagues';
import { fetchLeagues } from '../../services/api';

// Mock the API module
jest.mock('../../services/api');

const mockLeagues = [
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

describe('SportsLeagues', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchLeagues as jest.Mock).mockResolvedValue({ data: mockLeagues, error: null });
  });

  it('renders loading state initially', () => {
    render(<SportsLeagues />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('filters leagues by search input', async () => {
    render(<SportsLeagues />);
    
    await waitFor(() => {
      expect(screen.getByText('English Premier League')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText('Search leagues');
    fireEvent.change(searchInput, { target: { value: 'NBA' } });

    await waitFor(() => {
      expect(screen.queryByText('English Premier League')).not.toBeInTheDocument();
      expect(screen.getByText('NBA')).toBeInTheDocument();
    });
  });

  it('shows no results message when search returns empty', async () => {
    render(<SportsLeagues />);
    
    await waitFor(() => {
      expect(screen.getByText('English Premier League')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText('Search leagues');
    fireEvent.change(searchInput, { target: { value: 'XYZ' } });

    await waitFor(() => {
      expect(screen.getByText('No leagues found')).toBeInTheDocument();
    });
  });
}); 