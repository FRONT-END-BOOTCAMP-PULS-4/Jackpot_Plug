import YouTube from "react-youtube";
import type { YouTubePlayer, YouTubeEvent } from "react-youtube";
import Image from "next/image";
import { useState, useRef } from "react";
import styles from "./VideoListItem.module.scss";

interface VideoMediaProps {
  videoId?: string;
  isPlaying?: boolean;
  title?: string;
  src?: string;
  mode?: string;
  onPlayerReady?: (player: YouTubePlayer) => void;
}

export default function VideoMedia({
  videoId,
  isPlaying = false,
  title,
  src = "/images/sample-image.png",
  mode = "thumbnail",
  onPlayerReady,
}: VideoMediaProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);

  const handleThumbnailError = () => {
    setThumbnailError(true);
  };

  const handleReady = (e: YouTubeEvent) => {
    // 플레이어 인스턴스 저장
    playerRef.current = e.target;
    if (onPlayerReady) {
      onPlayerReady(e.target);
    }
  };

  if (videoId && isPlaying) {
    return (
      <YouTube
        videoId={videoId}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
          },
        }}
        className={styles.video_player}
        title="YouTube video player"
        onReady={handleReady}
      />
    );
  }

  if (videoId && !thumbnailError) {
    return (
      <Image
        className={styles.video_thumbnail_img}
        src={src}
        alt={`${title} thumbnail`}
        width={240}
        height={134}
        onError={handleThumbnailError}
      />
    );
  }

  return (
    <Image
      className={styles.thumbnail_img}
      src={src}
      alt={`${title} thumbnail`}
      width={mode === "playlist" ? 380 : 240}
      height={mode === "playlist" ? 250 : 134}
    />
  );
}
