import YouTube from "react-youtube";
import type { YouTubePlayer, YouTubeEvent } from "react-youtube";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./MusicPlayer.module.scss";

interface MusicPlayerProps {
  videoId?: string;
  isPlaying?: boolean;
  title?: string;
  src?: string;
  onPlayerReady?: (player: YouTubePlayer) => void;
  onVideoEnded?: () => void;
  onPlayPause?: () => void;
}

export default function MusicPlayer({
  videoId,
  isPlaying = false,
  title,
  src = "/images/sample-image.png",
  onPlayerReady,
  onVideoEnded,
  onPlayPause,
}: MusicPlayerProps) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleReady = (e: YouTubeEvent) => {
    if (e.target) {
      setPlayer(e.target);
      if (onPlayerReady) {
        onPlayerReady(e.target);
      }
    }
  };

  const handleStateChange = (e: YouTubeEvent) => {
    if (e.data === 0) {
      setVideoEnded(true);
      if (onVideoEnded) {
        onVideoEnded();
      }
    }
  };

  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayPause) {
      onPlayPause();
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    if (player) {
      try {
        if (isPlaying) {
          player.playVideo();
          setVideoEnded(false);
        } else {
          if (player.getPlayerState && player.getPlayerState() !== -1) {
            player.pauseVideo();
          }
        }
      } catch (error) {
        console.log("YouTube 플레이어 제어 중 오류");
      }
    }
  }, [isPlaying, player]);

  return (
    <>
      <div
        className={styles.music_player_wrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          className={styles.thumbnail_img}
          src={src}
          alt={`${title} thumbnail`}
          width={400}
          height={400}
        />

        {isHovering && (
          <div className={styles.player_overlay} onClick={handlePlayPauseClick}>
            <div
              className={`${styles.player_control_btn} ${
                isPlaying && !videoEnded
                  ? styles.pause_button
                  : styles.play_button
              }`}
            />
          </div>
        )}
      </div>

      {videoId && (
        <div className={styles.hidden_player}>
          <YouTube
            videoId={videoId}
            opts={{
              width: "1",
              height: "1",
              playerVars: {
                autoplay: isPlaying ? 1 : 0,
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
