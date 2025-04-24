"use client";
import styles from "./VideoListItem.module.scss";
import { IListItemProps } from "./ListItem";
import { videoListItemModeSwitcher } from "@/utils/modeSwitcher";
import { IconBtn } from "../button/Buttons";
import type { YouTubePlayer } from "react-youtube";
import { useEffect, useRef, useState } from "react";
import { decodeHtmlEntities } from "@/utils/decodeHtmlEntities";
import VideoMedia from "./VideoMedia";
import PlayerBar from "@/app/(anon)/components/playerbar/PlayerBar";

interface IVideoListItemProps extends IListItemProps {
  src?: string;
  duration?: string;
  isCertified?: boolean;
  onClick?: () => void;
  selected?: boolean;
  videoId?: string;
  isPlaying?: boolean;
  onVideoEnded?: () => void;
  onPlayPause?: () => void;
}

export default function VideoListItem({
  title,
  artist,
  isCertified,
  onClick,
  selected,
  mode = "thumbnail",
  src = "/images/sample-image.png",
  videoId,
  isPlaying = false,
  onVideoEnded,
  onPlayPause,
}: IVideoListItemProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [showProgressBar, setShowProgressBar] = useState(false);

  useEffect(() => {
    if (selected && isPlaying && videoId) {
      setShowProgressBar(true);
    }
  }, [selected, videoId, isPlaying]);

  const handleItemClick = (e: React.MouseEvent) => {
    // 프로그레스 바에서 발생한 클릭이라면 처리하지 않음
    if (
      (e.target as HTMLElement).closest(`.${styles.progress_container}`) ||
      (e.target as HTMLElement).closest(`.${styles.play_pause_overlay}`)
    ) {
      return;
    }

    if (mode === "video") return;
    if (onClick) {
      onClick();
    }
  };

  const handlePlayerReady = (player: YouTubePlayer) => {
    if (!player) return;

    playerRef.current = player;

    player.addEventListener("onStateChange", (e: any) => {
      if (e && e.data === 0 && onVideoEnded) {
        onVideoEnded();
      }
    });
  };

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);

      if (!isPlaying && onPlayPause) {
        onPlayPause();
      }
    }
  };

  const handlePlayPause = () => {
    if (onPlayPause) {
      onPlayPause();
    }

    if (!selected && onClick) {
      onClick();
    }
  };

  const decodedTitle = title ? decodeHtmlEntities(title) : "Meaning of you";
  const decodedArtist = artist ? decodeHtmlEntities(artist) : "아이유 IU";

  return (
    <li
      className={`${
        styles[videoListItemModeSwitcher(mode as string) as string]
      } ${selected && mode === "thumbnail" ? styles.selected : ""}`}
      onClick={handleItemClick}
    >
      <div className={styles.thumbnail_img_container}>
        <VideoMedia
          videoId={videoId}
          isPlaying={isPlaying}
          title={decodedTitle}
          src={src}
          mode={mode}
          onPlayerReady={handlePlayerReady}
          onVideoEnded={onVideoEnded}
          onPlayPause={handlePlayPause}
        />
        {mode === "playlist" && (
          <div className={styles.delete_btn_container}>
            <IconBtn icon="delete-playlist" size="sm" />
          </div>
        )}
      </div>

      {videoId && (
        <PlayerBar
          player={playerRef.current}
          isPlaying={isPlaying}
          onSeek={handleSeek}
          isVisible={showProgressBar}
        />
      )}

      <div className={styles.desc_container}>
        <span className={styles.title}>{decodedTitle}</span>
        <div className={styles.artist_container}>
          <span className={styles.artist}>{decodedArtist}</span>
          <div className={styles[isCertified ? "certified" : ""]}></div>
        </div>
        <div className={styles.add_playlist_btn}>
          <IconBtn icon="search-add-playlist" size="md" />
        </div>
      </div>
    </li>
  );
}
