"use client";
import styles from "./MusicPlayer.module.scss";
import { IListItemProps } from "../list/ListItem";
import { IconBtn } from "../button/Buttons";
import type { YouTubePlayer } from "react-youtube";
import { useEffect, useRef, useState } from "react";
import { decodeHtmlEntities } from "@/utils/decodeHtmlEntities";
import MusicPlayer from "./MusicPlayer";
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
  mode?: "player" | "list";
  onPlaylistAddAction?: () => void;
}

export default function MusicPlayerItem({
  title,
  artist,
  onClick,
  selected,
  src = "/images/sample-image.png",
  videoId,
  isPlaying = false,
  onVideoEnded,
  onPlayPause,
  mode = "player",
  isCertified,
  onPlaylistAddAction,
}: IVideoListItemProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [showProgressBar, setShowProgressBar] = useState(false);

  useEffect(() => {
    if (selected && isPlaying && videoId) {
      setShowProgressBar(true);
    }
  }, [selected, videoId, isPlaying]);

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

  const decodedTitle = title ? decodeHtmlEntities(title) : "Title";
  const decodedArtist = artist ? decodeHtmlEntities(artist) : "Artist";

  return (
    <li
      className={`${styles.music_player} ${
        mode === "list" ? styles.list_mode : ""
      }`}
    >
      <div className={styles.player_container}>
        <MusicPlayer
          videoId={videoId}
          isPlaying={isPlaying}
          title={decodedTitle}
          src={src}
          onPlayerReady={handlePlayerReady}
          onVideoEnded={onVideoEnded}
          onPlayPause={handlePlayPause}
        />
      </div>

      {videoId && (
        <PlayerBar
          player={playerRef.current}
          isPlaying={isPlaying}
          onSeek={handleSeek}
          isVisible={mode === "list" ? true : showProgressBar}
          mode={mode}
        />
      )}

      <div className={styles.music_info_container}>
        <span className={styles.title}>{decodedTitle}</span>
        <div className={styles.artist_info}>
          <span className={styles.artist}>{decodedArtist}</span>
          <div className={styles.certified}></div>
        </div>
        {isCertified && (
          <div className={styles.add_playlist_btn}>
            <IconBtn
              icon="search-add-playlist"
              size="md"
              onClick={() => onPlaylistAddAction?.()}
            />
          </div>
        )}
      </div>
    </li>
  );
}
