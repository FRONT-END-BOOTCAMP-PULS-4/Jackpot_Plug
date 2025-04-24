import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const updateAnimationState = () => {
    if (searchResults.length > 0 || isSearching) {
      setIsAnimating(true);
    }
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const validateSearchQuery = (query: string): boolean => {
    const regex = /^.+[-].+$/;
    return regex.test(query.trim());
  };

  const fetchSearchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);

      // 로컬 스토리지에서 검색 결과 확인
      const cacheKey = `search_result_${searchQuery}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        console.log("캐시된 결과 사용");
        const results = JSON.parse(cachedData);
        setSearchResults(results);
        setCurrentQuery(searchQuery);
        setSelectedVideoId(null);
        setIsPlaying(false);
        return;
      }

      const response = await axios.get("/api/search", {
        params: {
          q: searchQuery,
        },
      });

      const data = response.data;
      const results = data.items || [];

      localStorage.setItem(cacheKey, JSON.stringify(results));

      setSearchResults(data.items || []);
      setCurrentQuery(searchQuery);
      setSelectedVideoId(null);
      setIsPlaying(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
      updateAnimationState();
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setErrorMessage("검색어를 입력해주세요. ⚡️");
      setSearchResults([]);
      return;
    }

    if (!validateSearchQuery(query)) {
      setErrorMessage("'아티스트명-곡명' 정확하게 입력해주세요. 🔍");
      setSearchResults([]);
      return;
    }

    setErrorMessage(null);
    fetchSearchResults(query);
  };

  const resetSearch = () => {
    setQuery("");
    setSearchResults([]);
    setErrorMessage(null);
    setIsAnimating(false);
    setCurrentQuery("");
  };

  return {
    query,
    currentQuery,
    searchResults,
    errorMessage,
    isSearching,
    isAnimating,
    handleQueryChange,
    handleSearch,
    resetSearch,
    updateAnimationState,
  };
}
