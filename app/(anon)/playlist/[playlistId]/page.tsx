"use client";
import styles from "./page.module.scss";
import MusicPlayerItem from "@/app/components/player/MusicPlayerItem";
import ListItem from "@/app/components/list/ListItem";
import { usePlaylistDetail } from "./hooks/usePlaylistDetail";
import Dropdown, { DropdownOption } from "@/app/components/dropdown/Dropdown";

export default function Page() {
  const {
    router,
    playlistMusics,
    error,
    playlistTitle,
    isPlaying,
    selectedIndex,
    currentMusic,
    currentVideoId,
    handleItemSelect,
    handlePlayPause,
    handleVideoEnded,
  } = usePlaylistDetail();

  const dropdownOptions: DropdownOption[] = [
    {
      id: "title edit",
      label: "제목 수정",
      onClick: () => {
        console.log("Title Edit playlist");
      },
    },
    {
      id: "list edit",
      label: "리스트 수정",
      onClick: () => {
        console.log("List Edit playlist");
      },
    },
  ];

  return (
    <section className={styles.playlist_detail}>
      <button
        className={styles.back_btn}
        onClick={() => router.back()}
      >{`Playlists`}</button>
      <div className={styles.playlist_header}>
        <h2 className={styles.playlist_title}>{playlistTitle}</h2>
        <Dropdown options={dropdownOptions} align="right" />
      </div>

      {error && <div className={styles.error_message}>{error}</div>}

      <div className={styles.content_container}>
        <div className={styles.music_player}>
          {currentMusic && (
            <MusicPlayerItem
              key={currentVideoId} // 비디오 ID가 변경될 때 컴포넌트 재생성
              title={currentMusic.videoTitle}
              artist={currentMusic.channelId}
              src={currentMusic.thumbnail}
              videoId={currentVideoId || ""}
              isCertified={true}
              mode="list"
              isPlaying={isPlaying}
              onVideoEnded={handleVideoEnded}
              onPlayPause={() => handlePlayPause()}
              selected={true}
            />
          )}
        </div>

        <div className={styles.music_list}>
          <ul>
            {playlistMusics.map((music, index) => (
              <ListItem
                key={music.id}
                title={music.videoTitle}
                artist={music.channelId}
                thumbnailSrc={music.thumbnail}
                onPlayPauseClick={() => handlePlayPause(index)}
                mode="playlistMusic"
                index={index}
                isPlaylistSelected={selectedIndex === index && !isPlaying}
                isPlaying={isPlaying}
                isCurrentlyPlaying={selectedIndex === index}
                onItemClick={handleItemSelect}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
