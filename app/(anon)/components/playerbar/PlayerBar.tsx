"use client";
import styles from "./PlayerBar.module.scss";
import type { YouTubePlayer } from "react-youtube";
import { formatTime } from "./utils/formatTime";
import { usePlayerProgress } from "./hooks/usePlayerProgress";

interface PlayerBarProps {
  player: YouTubePlayer | null;
  isPlaying: boolean;
  onSeek?: (seconds: number) => void;
  isVisible?: boolean;
  mode?: "player" | "list";
}

export default function PlayerBar({
  player,
  isPlaying,
  onSeek,
  isVisible = false,
  mode = "player",
}: PlayerBarProps) {
  const {
    currentTime,
    duration,
    progress,
    progressBarRef,
    handleProgressBarClick,
    handleMouseDown,
  } = usePlayerProgress({ player, isPlaying, onSeek });

  return (
    <div
      className={`${styles.progress_container} ${
        isVisible ? styles.visible : ""
      } ${mode === "list" ? styles.list_mode : ""}`}
      role="progressbar"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={styles.progress_bar_container}
        onClick={handleProgressBarClick}
        onMouseDown={handleMouseDown}
        ref={progressBarRef}
      >
        <div
          className={styles.progress_bar}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className={styles.time_display}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
