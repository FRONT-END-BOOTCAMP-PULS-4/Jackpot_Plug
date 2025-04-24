"use client";
import styles from "./PlayerBar.module.scss";
import React, { useEffect, useRef, useState } from "react";
import type { YouTubePlayer } from "react-youtube";
import { IconBtn } from "@/app/components/button/Buttons";

interface PlayerBarProps {
  player: YouTubePlayer | null;
  isPlaying: boolean;
  onSeek?: (seconds: number) => void;
}

export default function PlayerBar({
  player,
  isPlaying,
  onSeek,
}: PlayerBarProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // 시간을 분:초 형식으로 변환
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // 진행 상태 업데이트
  const updateProgress = () => {
    if (!player) return;

    try {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();

      if (isNaN(duration) || duration === 0) return;

      setCurrentTime(currentTime);
      setDuration(duration);
      setProgress((currentTime / duration) * 100);
    } catch (error) {
      console.error("진행 상태 업데이트 오류:", error);
    }
  };

  // 진행바 클릭 처리
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !player || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPosition * duration;

    // 플레이어 시간 이동
    player.seekTo(seekTime, true);

    setCurrentTime(seekTime);
    setProgress(clickPosition * 100);

    if (onSeek) {
      onSeek(seekTime);
    }
  };

  //플레이어 상태 변경시 인터벌 설정/해제
  useEffect(() => {
    if (player && isPlaying) {
      updateProgress();

      progressInterval.current = setInterval(updateProgress, 1000);
    } else {
      // 정지 상태면 인터벌 제거
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [player, isPlaying]);

  // 플레이어 객체가 변경될 때마다 초기 상태 업데이트
  useEffect(() => {
    if (player) {
      try {
        const videoLength = player.getDuration();
        if (!isNaN(videoLength) && videoLength > 0) {
          setDuration(videoLength);
        }
      } catch (error) {
        console.error("동영상 길이 가져오기 오류:", error);
      }
    }
  }, [player]);

  return (
    <figure className={styles.progress_container}>
      <figcaption className="blind">현재 재생 중인 음원</figcaption>

      <div
        className={styles.progress_bar_container}
        onClick={handleProgressBarClick}
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
    </figure>
  );
}
