"use client";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.scss";
import MusicPlayerItem from "@/app/components/player/MusicPlayerItem";
import ListItem from "@/app/components/list/ListItem";
import { useEffect, useState } from "react";
import { usePlaylistStore } from "@/store/usePlaylistStore";

interface PlaylistMusic {
  id: string;
  ISRC: string;
  musics: {
    video_id: string;
    video_title: string;
    channel_id: string;
    thumbnail?: string;
  };
}

export default function Page() {
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

  const currentMusic =
    currentIndex !== null ? playlistMusics[currentIndex] : null;
  const currentVideoId = currentMusic?.musics.video_id || null;

  useEffect(() => {
    const fetchPlaylistMusics = async () => {
      try {
        setError(null);

        // 플레이리스트 목록이 없으면 먼저 가져오기
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

        const res = await fetch(
          `/api/playlist-videos?playlistId=${playlistId}`
        );

        if (!res.ok) {
          throw new Error("플레이리스트 비디오를 불러오는데 실패했습니다.");
        }

        const data = await res.json();
        setPlaylistMusics(data);

        if (data.length > 0) {
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

  const handleVideoEnded = () => {
    if (currentIndex !== null && currentIndex < playlistMusics.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <section className={styles.playlist_detail}>
      <button
        className={styles.back_btn}
        onClick={() => router.back()}
      >{`Playlists`}</button>
      <h2 className={styles.playlist_title}>{playlistTitle}</h2>

      {error && <div className={styles.error_message}>{error}</div>}

      <div className={styles.content_container}>
        <div className={styles.music_player}>
          {currentMusic && (
            <MusicPlayerItem
              title={currentMusic.musics.video_title}
              artist={currentMusic.musics.channel_id}
              src={currentMusic.musics.thumbnail}
              videoId={currentVideoId || ""}
              isCertified={true}
              mode="list"
              isPlaying={isPlaying}
              onVideoEnded={handleVideoEnded}
              onPlayPause={() => handlePlayPause()}
              selected={true}
            />
          )}
        </div>

        <div className={styles.music_list}>
          <ul>
            {playlistMusics.map((music, index) => (
              <ListItem
                key={music.id}
                title={music.musics.video_title}
                artist={music.musics.channel_id}
                thumbnailSrc={music.musics.thumbnail}
                onPlayPauseClick={() => handlePlayPause(index)}
                mode="playlistMusic"
                index={index}
                isPlaylistSelected={selectedIndex === index && !isPlaying}
                isPlaying={isPlaying}
                isCurrentlyPlaying={selectedIndex === index}
                onItemClick={handleItemSelect}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
