"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
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

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const fetchSearchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      console.log("검색어:", searchQuery);

      const response = await axios.get("/api/search", {
        params: {
          q: searchQuery,
        },
      });

      const data = response.data;
      console.log("API 응답 데이터:", data);

      // 검색 결과가 있는지 확인
      if (data.items && data.items.length > 0) {
        console.log("첫 번째 검색 결과:", data.items[0].snippet.title);
      } else {
        console.log("검색 결과 없음");
      }

      // Spotify 트랙 정보가 있는지 확인
      if (data.spotifyTracks && data.spotifyTracks.length > 0) {
        console.log(
          "Spotify 첫 번째 트랙:",
          data.spotifyTracks[0].name,
          "by",
          data.spotifyTracks[0].artist
        );
        console.log("ISRC 코드:", data.spotifyTracks[0].isrc);
      }

      setSearchResults(data.items || []);
      setCurrentQuery(searchQuery);
      setSelectedVideoId(null);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      fetchSearchResults(query);
    }
  };

  const handleVideoSelect = (videoId: string) => {
    if (selectedVideoId === videoId) {
      setSelectedVideoId(null);
    } else {
      setSelectedVideoId(videoId);
    }
  };

  return (
    <section className={styles.search}>
      <Title
        titleText="검색 그 이상. 필요한 것과의 진짜 연결."
        descriptionText={`당신이 찾는 정보는 단순한 결과가 아닙니다.
          우리는 방대한 데이터 속에서 가장 의미 있는 연결을 찾아, 당신을 위한 연결이 자연스럽게 완성됩니다.
          `}
      />

      <form onSubmit={handleSearch} className={styles.search_form}>
        <SearchInput
          placeholder="찾고 싶은 음악 또는 아티스트를 검색해 보세요."
          buttonIcon={<IconBtn icon="search" size="lg" type="submit" />}
          value={query}
          onChange={handleQueryChange}
        />
      </form>

      {searchResults.length > 0 && (
        <ul className={styles.container}>
          {searchResults.map((result, idx) => (
            <VideoListItem
              key={result.id.videoId || idx}
              src={result.snippet.thumbnails.high.url}
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
    </section>
  );
}
