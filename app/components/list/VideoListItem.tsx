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
  }, [selected, isPlaying, videoId]);

  const handleItemClick = () => {
    if (mode === "video") return;
    if (onClick) {
      onClick();
    }

    if (selected && !showProgressBar && videoId) {
      setShowProgressBar(true);
    }
  };

  const handlePlayerReady = (player: YouTubePlayer) => {
    if (!player) return;

    playerRef.current = player;

    player.addEventListener("onStateChange", (e: any) => {
      if (e && e.data === 0 && onVideoEnded) {
      }
    });
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
        />
        {mode === "playlist" && (
          <div className={styles.delete_btn_container}>
            <IconBtn icon="delete-playlist" size="sm" />
          </div>
        )}
      </div>

      {showProgressBar && videoId && (
        <PlayerBar
          player={playerRef.current}
          isPlaying={isPlaying}
          onSeek={(seconds) => {
            if (playerRef.current) {
              playerRef.current.seekTo(seconds, true);
            }
          }}
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
