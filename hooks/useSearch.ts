import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

export function useSearch() {
  const [query, setQuery] = useState(""); // 검색창 입력값
  const [currentQuery, setCurrentQuery] = useState(""); // 현재 검색된 쿼리
  const [searchResults, setSearchResults] = useState<any[]>([]); // 검색 결과 배열
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null); // 선택된 비디오 ID
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 에러 메시지
  const [isSearching, setIsSearching] = useState(false); // 검색 중 상태
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 표시 상태

  const updateAnimationState = () => {
    if (searchResults.length > 0 || isSearching) {
      setIsAnimating(true);
    }
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
}
