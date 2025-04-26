import React, { useEffect, useRef, useState } from "react";
import type { YouTubePlayer } from "react-youtube";

interface UsePlayerProgressProps {
  player: YouTubePlayer | null;
  isPlaying: boolean;
  onSeek?: (seconds: number) => void;
}

export function usePlayerProgress({
  player,
  isPlaying,
  onSeek,
}: UsePlayerProgressProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const interactionRef = useRef(false); // 드래그 or 시크 중인지 단일 플래그로 관리

  // 진행 상태 업데이트
  const updateProgress = () => {
    if (!player || interactionRef.current) return;

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
    const clampedPosition = Math.max(0, Math.min(1, position));
    return clampedPosition * duration;
  };

  // 진행바 클릭 처리
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!progressBarRef.current || !player || !duration) return;

    const seekTime = calculateTimeFromPosition(e.clientX);

    // UI 업데이트
    setCurrentTime(seekTime);
    setProgress((seekTime / duration) * 100);

    // 플레이어 시간 이동
    interactionRef.current = true;
    player.seekTo(seekTime, true);

    if (onSeek) {
      onSeek(seekTime);
    }

    // 시크 상태 해제
    setTimeout(() => {
      interactionRef.current = false;
    }, 200);
  };

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    interactionRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // 드래그 중
  const handleMouseMove = (e: MouseEvent) => {
    if (!interactionRef.current || !progressBarRef.current || !duration) return;

    const seekTime = calculateTimeFromPosition(e.clientX);

    // UI만 업데이트 (실제 재생 위치는 변경하지 않음)
    setCurrentTime(seekTime);
    setProgress((seekTime / duration) * 100);
  };

  // 드래그 종료
  const handleMouseUp = (e: MouseEvent) => {
    if (!interactionRef.current || !player) return;

    const seekTime = calculateTimeFromPosition(e.clientX);

    // 실제 재생 위치 변경
    player.seekTo(seekTime, true);

    if (onSeek) {
      onSeek(seekTime);
    }

    // 드래그 상태 해제
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    setTimeout(() => {
      interactionRef.current = false;
    }, 200);
  };

  // 플레이어 상태 변경시 인터벌 설정/해제
  useEffect(() => {
    if (player && isPlaying) {
      updateProgress();
      progressInterval.current = setInterval(updateProgress, 100);
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

  return {
    currentTime,
    duration,
    progress,
    progressBarRef,
    handleProgressBarClick,
    handleMouseDown,
  };
}
