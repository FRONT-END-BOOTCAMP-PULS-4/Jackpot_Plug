import { useState } from "react";

export function useVideoPlayer(): {
  selectedVideoId: string | null;
  isPlaying: boolean;
  lastPlayed: string | null;
  handleVideoSelect: (videoId: string) => void;
  handleVideoEnded: () => void;
  resetPlayer: () => void;
} {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);

  const handleVideoSelect = (videoId: string): void => {
    if (selectedVideoId === videoId) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedVideoId(videoId);
      setIsPlaying(true);
    }
    setLastPlayed(videoId);
  };

  const handleVideoEnded = (): void => {
    setIsPlaying(false);
  };

  const resetPlayer = (): void => {
    setSelectedVideoId(null);
    setIsPlaying(false);
    setLastPlayed(null);
  };

  return {
    selectedVideoId,
    isPlaying,
    lastPlayed,
    handleVideoSelect,
    handleVideoEnded,
    resetPlayer,
  };
}
