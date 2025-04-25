"use client";
import styles from "./MusicPlayer.module.scss";
import { IListItemProps } from "../list/ListItem";
import { videoListItemModeSwitcher } from "@/utils/modeSwitcher";
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
}

export default function MusicPlayerItem({
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
    <li className={styles.music_player}>
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
          isVisible={showProgressBar}
        />
      )}

      <div className={styles.music_info_container}>
        <span className={styles.title}>{decodedTitle}</span>
        <div className={styles.artist_info}>
          <span className={styles.artist}>{decodedArtist}</span>
          <div className={styles.certified}></div>
        </div>
        <div className={styles.add_playlist_btn}>
          <IconBtn icon="search-add-playlist" size="md" />
        </div>
      </div>
    </li>
  );
}
