"use client";
import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import Title from "../../components/title/Title";
import styles from "./page.module.scss";
import SearchInput from "@/app/components/input/SearchInput";
import { IconBtn } from "@/app/components/button/Buttons";
import VideoListItem from "@/app/components/list/VideoListItem";

export default function Page() {
  const [query, setQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 검색 결과가 있거나 검색 중일 때 애니메이션 상태 변경
  useEffect(() => {
    if (searchResults.length > 0 || isSearching) {
      setIsAnimating(true);
    }
  }, [searchResults, isSearching]);

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
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsSearching(false);
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

  const handleVideoSelect = (videoId: string) => {
    if (selectedVideoId === videoId) {
      setSelectedVideoId(null);
    } else {
      setSelectedVideoId(videoId);
    }
  };

  return (
    <section
      className={`${styles.search} ${isAnimating ? styles.searching : ""}`}
      ref={searchContainerRef}
    >
      <div className={styles.title_container}>
        <Title
          titleText="검색 그 이상. 필요한 것과의 진짜 연결."
          descriptionText={`당신이 찾는 정보는 단순한 결과가 아닙니다.
          우리는 방대한 데이터 속에서 가장 의미 있는 연결을 찾아, 당신을 위한 연결이 자연스럽게 완성됩니다.`}
        />
      </div>

      <form
        className={styles.search_form}
        onSubmit={handleSearch}
        ref={formRef}
      >
        <SearchInput
          placeholder="'아티스트명-곡명' 형식으로 입력해 주세요. ex) Gdragon-power"
          buttonIcon={<IconBtn icon="search" size="lg" type="submit" />}
          value={query}
          onChange={handleQueryChange}
        />
      </form>

      {errorMessage && (
        <p className={`${styles.error_message}`}>{errorMessage}</p>
      )}

      <div className={styles.result_container}>
        {isSearching && <div className={styles.loading}>검색 중...</div>}

        {searchResults.length > 0 && (
          <ul className={styles.result_music}>
            {searchResults.map((result, idx) => (
              <VideoListItem
                key={result.id.videoId || idx}
                src={
                  result.snippet.thumbnails.high?.url ||
                  result.snippet.thumbnails.medium?.url ||
                  result.snippet.thumbnails.default?.url
                }
                title={result.snippet.title}
                artist={result.snippet.channelTitle}
                isCertified={true}
                mode="thumbnail"
                videoId={result.id.videoId}
                selected={selectedVideoId === result.id.videoId}
                onClick={() => handleVideoSelect(result.id.videoId)}
                isPlaying={selectedVideoId === result.id.videoId}
              />
            ))}
          </ul>
        )}

        {isAnimating &&
          searchResults.length === 0 &&
          !isSearching &&
          !errorMessage && (
            <p className={styles.no_results}>찾으시는 음원은 없어요. 😢</p>
          )}
      </div>
    </section>
  );
}
