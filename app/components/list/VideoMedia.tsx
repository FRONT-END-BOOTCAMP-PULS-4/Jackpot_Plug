import YouTube from "react-youtube";
import type { YouTubePlayer, YouTubeEvent } from "react-youtube";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import styles from "./VideoListItem.module.scss";

interface VideoMediaProps {
  videoId?: string;
  isPlaying?: boolean;
  title?: string;
  src?: string;
  mode?: string;
  onPlayerReady?: (player: YouTubePlayer) => void;
  onVideoEnded?: () => void;
}

export default function VideoMedia({
  videoId,
  isPlaying = false,
  title,
  src = "/images/sample-image.png",
  mode = "thumbnail",
  onPlayerReady,
  onVideoEnded,
}: VideoMediaProps) {
  const [videoEnded, setVideoEnded] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  const handleReady = (e: YouTubeEvent) => {
    if (e.target) {
      setPlayer(e.target);
      if (onPlayerReady) {
        onPlayerReady(e.target);
      }
    }
  };

  const handleStateChange = (e: YouTubeEvent) => {
    if (e.data === 0 && onVideoEnded) {
      onVideoEnded();
    }
  };

  useEffect(() => {
    if (player) {
      try {
        if (isPlaying) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
      } catch (error) {
        console.error("YouTube 플레이어 제어 중 오류:", error);
      }
    }
  }, [isPlaying, videoEnded]);

  return (
    <>
      {/* 썸네일 이미지 */}
      <div className={styles.thumbnail_wrapper}>
        <Image
          className={styles.video_thumbnail_img}
          src={src}
          alt={`${title} thumbnail`}
          width={400}
          height={400}
          style={{
            width: "134%",
            height: "134%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      {/* 오디오만 재생 (YouTube 플레이어 숨김) */}
      {videoId && (
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            opacity: 0,
          }}
        >
          <YouTube
            videoId={videoId}
            opts={{
              width: "1",
              height: "1",
              playerVars: {
                autoplay: 1,
                controls: 0,
                fs: 0,
                rel: 0,
              },
            }}
            onReady={handleReady}
            onStateChange={handleStateChange}
          />
        </div>
      )}
    </>
  );
}

{
  /* return (
    <Image
      className={styles.thumbnail_img}
      src={src}
      alt={`${title} thumbnail`}
      width={mode === "playlist" ? 400 : 400}
      height={mode === "playlist" ? 400 : 400}
    />
  ); */
}
