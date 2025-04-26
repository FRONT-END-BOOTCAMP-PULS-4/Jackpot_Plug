"use client";
import PlaylistItem from "@/app/components/list/PlaylistItem";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import { usePlaylists, Playlist } from "./hooks/usePlaylists";

export default function page() {
  const router = useRouter();
  const { playlists, loading, error } = usePlaylists();

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
                {playlists.map((playlist: Playlist) => (
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
