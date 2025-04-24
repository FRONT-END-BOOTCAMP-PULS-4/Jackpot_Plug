"use client";
import styles from "./PlayerBar.module.scss";
import React, { useEffect, useRef, useState } from "react";
import type { YouTubePlayer } from "react-youtube";

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
  const isSeeking = useRef(false);
  const isDragging = useRef(false);

  // 시간을 분:초 형식으로 변환
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // 진행 상태 업데이트
  const updateProgress = () => {
    if (!player || isSeeking.current || isDragging.current) return;

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

  // 클릭 위치로 시간 계산
  const calculateTimeFromPosition = (clientX: number): number => {
    if (!progressBarRef.current || !duration) return 0;

    const rect = progressBarRef.current.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    const clampedPosition = Math.max(0, Math.min(1, position)); // 0~1 사이로 제한
    return clampedPosition * duration;
  };

  // 진행바 클릭 처리
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // 이벤트 버블링 방지

    if (!progressBarRef.current || !player || !duration) return;

    const seekTime = calculateTimeFromPosition(e.clientX);

    // UI 업데이트
    setCurrentTime(seekTime);
    setProgress((seekTime / duration) * 100);

    // 플레이어 시간 이동
    isSeeking.current = true;
    player.seekTo(seekTime, true);

    if (onSeek) {
      onSeek(seekTime);
    }

    // 시크 상태 해제
    setTimeout(() => {
      isSeeking.current = false;
    }, 200);
  };

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // 드래그 중
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !progressBarRef.current || !duration) return;

    const seekTime = calculateTimeFromPosition(e.clientX);

    // UI만 업데이트 (실제 재생 위치는 변경하지 않음)
    setCurrentTime(seekTime);
    setProgress((seekTime / duration) * 100);
  };

  // 드래그 종료
  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging.current || !player) return;

    const seekTime = calculateTimeFromPosition(e.clientX);

    // 실제 재생 위치 변경
    isSeeking.current = true;
    player.seekTo(seekTime, true);

    if (onSeek) {
      onSeek(seekTime);
    }

    // 드래그 및 시크 상태 해제
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    setTimeout(() => {
      isSeeking.current = false;
    }, 200);
  };

  // 플레이어 상태 변경시 인터벌 설정/해제
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
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [player, isPlaying]);

  // 플레이어 객체가 변경될 때마다 초기 상태 업데이트
  useEffect(() => {
    if (player) {
      try {
        const videoLength = player.getDuration();
        if (!isNaN(videoLength) && videoLength > 0) {
          setDuration(videoLength);
          updateProgress();
        }
      } catch (error) {
        console.error("동영상 길이 가져오기 오류:", error);
      }
    }
  }, [player]);

  return (
    <figure
      className={styles.progress_container}
      onClick={(e) => e.stopPropagation()}
    >
      <figcaption className="blind">현재 재생 중인 음원</figcaption>

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
    </figure>
  );
}
