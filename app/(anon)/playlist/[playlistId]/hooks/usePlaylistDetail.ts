import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import axios from "axios";

interface PlaylistMusic {
  id: string;
  ISRC: string;
  videoId: string;
  videoTitle: string;
  channelId: string;
  thumbnail?: string;
}

export function usePlaylistDetail() {
  const router = useRouter();
  const params = useParams();
  const playlistId = params.playlistId as string;
  const { fetchPlaylists, playlists } = usePlaylistStore();

  const [playlistMusics, setPlaylistMusics] = useState<PlaylistMusic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const nextVideoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldPlayNextRef = useRef(false);

  const currentMusic =
    currentIndex !== null ? playlistMusics[currentIndex] : null;
  const currentVideoId = currentMusic?.videoId || null;

  useEffect(() => {
    const fetchPlaylistMusics = async () => {
      try {
        setError(null);

        if (playlists.length === 0) {
          const authStorage = localStorage.getItem("auth-storage");
          if (authStorage) {
            const authData = JSON.parse(authStorage);
            const userId = authData.state.user?.id;

            if (userId) {
              await fetchPlaylists(userId);
            }
          }
        }

        const res = await axios.get(
          `/api/playlist-videos?playlistId=${playlistId}`
        );
        setPlaylistMusics(res.data);

        if (res.data.length > 0) {
          setCurrentIndex(0);
          setIsPlaying(false);
        }
      } catch (err) {
        console.error("플레이리스트 상세 조회 오류:", err);
        setError("플레이리스트 음악을 불러오는데 실패했습니다.");
      }
    };

    if (playlistId) {
      fetchPlaylistMusics();
    }

    return () => {
      if (nextVideoTimeoutRef.current) {
        clearTimeout(nextVideoTimeoutRef.current);
      }
    };
  }, [playlistId, fetchPlaylists, playlists.length]);

  useEffect(() => {
    const playlist = playlists.find((pl) => pl.id === playlistId);
    if (playlist) {
      setPlaylistTitle(playlist.title);
    }
  }, [playlists, playlistId]);

  const handleItemSelect = (index: number) => {
    setCurrentIndex(index);
    setSelectedIndex(index);
    setIsPlaying(true);
  };

  const handlePlayPause = (index?: number) => {
    if (index !== undefined) {
      if (currentIndex === index) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentIndex(index);
        setSelectedIndex(index);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const playNextVideo = () => {
    if (currentIndex !== null && currentIndex < playlistMusics.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedIndex(nextIndex);
      setIsPlaying(true);
      shouldPlayNextRef.current = false;
    } else {
      setIsPlaying(false);
    }
  };

  const handleVideoEnded = () => {
    shouldPlayNextRef.current = true;

    nextVideoTimeoutRef.current = setTimeout(() => {
      if (shouldPlayNextRef.current) {
        playNextVideo();
      }
    }, 1000);
  };

  return {
    router,
    playlistMusics,
    error,
    playlistTitle,
    isPlaying,
    currentIndex,
    selectedIndex,
    currentMusic,
    currentVideoId,
    handleItemSelect,
    handlePlayPause,
    handleVideoEnded,
  };
}
