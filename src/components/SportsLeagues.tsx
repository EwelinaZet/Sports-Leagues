import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { League } from '../types/api';
import { fetchLeagues, fetchSeasonBadge, extractBadgeUrl, handleApiError } from '../services/api';
import { useApiCache, CACHE_KEYS } from '../hooks/useApiCache';
import SeasonBadgeModal from './SeasonBadgeModal';
import { SkeletonCard, SkeletonTitle, SkeletonText } from './Skeleton';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px 0;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px 0;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    padding: 24px 0;
  }
`;

const LeagueCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      border-color: #007bff;
    }
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
  }
`;

const LeagueTitle = styled.h2`
  font-size: 1.1rem;
  margin: 0 0 8px 0;
  color: #333;
  
  @media (min-width: 640px) {
    font-size: 1.2rem;
    margin: 0 0 10px 0;
  }
`;

const LeagueInfo = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
  
  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const SearchContainer = styled.div`
  padding: 16px 0;
  max-width: 600px;
  margin: 0 auto;

  @media (min-width: 640px) {
    padding: 20px 0;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
  margin-bottom: 12px;

  @media (min-width: 640px) {
    font-size: 16px;
    margin-bottom: 16px;
  }

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const FilterContainer = styled.div`
  position: relative;
  margin-top: 12px;
`;

const FilterButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: #007bff;
  }
`;

const DropdownContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  input {
    margin-right: 8px;
  }
`;

const SelectedSports = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const SportTag = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;

  button {
    background: none;
    border: none;
    color: #1976d2;
    cursor: pointer;
    padding: 0;
    font-size: 16px;
    line-height: 1;
  }
`;

const LoadingGrid = () => (
  <GridContainer data-testid="loading-skeleton">
    {[...Array(12)].map((_, index) => (
      <SkeletonCard key={index}>
        <SkeletonTitle />
        <SkeletonText />
        <SkeletonText />
      </SkeletonCard>
    ))}
  </GridContainer>
);

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #dc3545;
`;

const SportsLeagues: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [filteredLeagues, setFilteredLeagues] = useState<League[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBadgeUrl, setSelectedBadgeUrl] = useState<string | null>(null);
  const [isBadgeLoading, setIsBadgeLoading] = useState(false);
  const [badgeError, setBadgeError] = useState<string | null>(null);
  const { getFromCache, setToCache } = useApiCache();

  useEffect(() => {
    const fetchAndCacheLeagues = async () => {
      try {
        // Try to get leagues from cache first
        const cachedLeagues = getFromCache<League[]>(CACHE_KEYS.ALL_LEAGUES);
        
        if (cachedLeagues) {
          setLeagues(cachedLeagues);
          setFilteredLeagues(cachedLeagues);
          setLoading(false);
          return;
        }

        // If not in cache, fetch from API
        const result = await fetchLeagues();
        
        if (result.error) {
          setError(handleApiError(result.error));
          setLoading(false);
          return;
        }

        setLeagues(result.data);
        setFilteredLeagues(result.data);
        
        // Cache the fetched data
        setToCache(CACHE_KEYS.ALL_LEAGUES, result.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch leagues data');
        setLoading(false);
      }
    };

    fetchAndCacheLeagues();
  }, []);

  const handleLeagueClick = async (leagueId: string) => {
    setIsModalOpen(true);
    setIsBadgeLoading(true);
    setBadgeError(null);
    setSelectedBadgeUrl(null);

    try {
      // Try to get badge from cache first
      const cacheKey = `${CACHE_KEYS.SEASONS}_badge_${leagueId}`;
      const cachedBadge = getFromCache<string>(cacheKey);
      
      if (cachedBadge) {
        setSelectedBadgeUrl(cachedBadge);
        setIsBadgeLoading(false);
        return;
      }

      // If not in cache, fetch from API
      const result = await fetchSeasonBadge(leagueId);
      const badgeUrl = extractBadgeUrl(result);
      
      if (result.error) {
        setBadgeError(handleApiError(result.error));
      } else if (badgeUrl) {
        setSelectedBadgeUrl(badgeUrl);
        setToCache(cacheKey, badgeUrl);
      } else {
        setBadgeError('No badge available for this league');
      }
    } catch (err) {
      setBadgeError('Failed to load badge');
    } finally {
      setIsBadgeLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBadgeUrl(null);
    setBadgeError(null);
  };

  const debouncedSearch = useCallback(
    (value: string, sports: string[]) => {
      const filtered = leagues.filter((league) => {
        const matchesSearch = league.strLeague.toLowerCase().includes(value.toLowerCase());
        const matchesSport = sports.length === 0 || sports.includes(league.strSport);
        return matchesSearch && matchesSport;
      });
      setFilteredLeagues(filtered);
    },
    [leagues]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchTerm, selectedSports);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedSports, debouncedSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSportToggle = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const handleRemoveSport = (sport: string) => {
    setSelectedSports(prev => prev.filter(s => s !== sport));
  };

  // Add back the uniqueSports calculation
  const uniqueSports = useMemo(() => {
    const sports = new Set(leagues.map(league => league.strSport));
    return Array.from(sports).sort();
  }, [leagues]);

  if (loading) {
    return (
      <Container>
        <SearchContainer>
          <SearchInput disabled placeholder="Loading leagues..." />
        </SearchContainer>
        <LoadingGrid />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer role="alert">
          Error: {error}
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <SearchContainer>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search leagues..."
          aria-label="Search leagues"
        />
        <FilterContainer>
          <FilterButton
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Filter by sport"
            aria-expanded={isDropdownOpen}
            aria-controls="sport-filter-dropdown"
          >
            Filter by Sport
            <span>{isDropdownOpen ? '▼' : '▲'}</span>
          </FilterButton>
          <DropdownContainer 
            isOpen={isDropdownOpen}
            id="sport-filter-dropdown"
            role="listbox"
          >
            {Array.from(new Set(leagues.map(league => league.strSport))).map(sport => (
              <CheckboxLabel key={sport}>
                <input
                  type="checkbox"
                  checked={selectedSports.includes(sport)}
                  onChange={() => handleSportToggle(sport)}
                  aria-label={`Filter by ${sport}`}
                />
                {sport}
              </CheckboxLabel>
            ))}
          </DropdownContainer>
        </FilterContainer>
      </SearchContainer>

      {filteredLeagues.length === 0 ? (
        <ErrorContainer>No leagues found</ErrorContainer>
      ) : (
        <GridContainer>
          {filteredLeagues.map(league => (
            <LeagueCard
              key={league.idLeague}
              onClick={() => handleLeagueClick(league.idLeague)}
              role="button"
              tabIndex={0}
              aria-label={`View ${league.strLeague} details`}
            >
              <LeagueTitle>{league.strLeague}</LeagueTitle>
              <LeagueInfo>{league.strSport}</LeagueInfo>
              {league.strCurrentSeason && (
                <LeagueInfo>Season: {league.strCurrentSeason}</LeagueInfo>
              )}
            </LeagueCard>
          ))}
        </GridContainer>
      )}

      <SeasonBadgeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        badgeUrl={selectedBadgeUrl}
        isLoading={isBadgeLoading}
        error={badgeError}
      />
    </Container>
  );
};

export default SportsLeagues; 