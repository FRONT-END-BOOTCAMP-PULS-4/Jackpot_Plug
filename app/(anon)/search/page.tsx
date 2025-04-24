"use client";
import React, { useEffect, useRef } from "react";
import Title from "../../components/title/Title";
import styles from "./page.module.scss";
import SearchInput from "@/app/components/input/SearchInput";
import { IconBtn } from "@/app/components/button/Buttons";
import VideoListItem from "@/app/components/list/VideoListItem";

import { useSearch } from "./hooks/useSearch";
import { useVideoPlayer } from "./hooks/useVideoPlayer";

export default function Page() {
  const {
    query,
    searchResults,
    errorMessage,
    isSearching,
    isAnimating,
    handleQueryChange,
    handleSearch,
    updateAnimationState,
  } = useSearch();

  const { selectedVideoId, isPlaying, handleVideoSelect, handleVideoEnded } =
    useVideoPlayer();

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    updateAnimationState();
  }, [searchResults, isSearching]);

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
                  result.snippet.thumbnails.maxres?.url ||
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
                isPlaying={selectedVideoId === result.id.videoId && isPlaying}
                onVideoEnded={handleVideoEnded}
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
