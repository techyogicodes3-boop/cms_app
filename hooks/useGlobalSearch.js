import { useState, useCallback } from 'react';
import { performSearch } from '../services/search.service';

export function useGlobalSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);

  // API call
  const search = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      setSearchResults(null);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await performSearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error.message || 'Search failed');
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchError(null);
    setIsSearching(false);
  }, []);

  return {
    search,
    clearSearch,
    isSearching,
    searchResults,
    searchError,
  };
}