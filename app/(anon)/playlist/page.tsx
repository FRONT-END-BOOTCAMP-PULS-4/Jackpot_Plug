"use client";
import PlaylistItem from "@/app/components/list/PlaylistItem";
import styles from "./page.module.scss";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Playlist {
  id: string;
  title: string;
  thumbnail: string | null;
}

export default function page() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const authStorage = localStorage.getItem("auth-storage");
        console.log("Auth Storage:", authStorage); // 디버깅용 로그

        if (!authStorage) {
          setError("사용자 인증 정보가 없습니다");
          setLoading(false);
          return;
        }

        const authData = JSON.parse(authStorage);
        const userId = authData.state.user?.id;

        if (!userId) {
          setError("사용자 ID를 찾을 수 없습니다");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/playlist?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "플레이리스트 조회에 실패했습니다"
          );
        }

        const data = await response.json();
        setPlaylists(data);
      } catch (err) {
        setError(
          "플레이리스트 조회 오류: " +
            (err instanceof Error ? err.message : String(err))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistClick = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  return (
    <section className={styles.playlist}>
      <div className={styles.playlist_title}>
        <h2>내 플레이리스트</h2>
        <span>{playlists.length}</span>
      </div>

      <div className={styles.playlist_container}>
        {loading ? (
          <span>플레이리스트를 불러오는 중...</span>
        ) : error ? (
          <span className={styles.error}>{error}</span>
        ) : (
          <>
            {playlists.length === 0 ? (
              <span className={styles.no_playlist}>
                플레이리스트가 없습니다.
              </span>
            ) : (
              <ul className={styles.playlist_grid}>
                {playlists.map((playlist) => (
                  <PlaylistItem
                    key={playlist.id}
                    title={playlist.title}
                    src={playlist.thumbnail || undefined}
                    onClick={() => handlePlaylistClick(playlist.id)}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
