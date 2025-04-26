"use client";
import PlaylistItem from "@/app/components/list/PlaylistItem";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import { usePlaylists, Playlist } from "./hooks/usePlaylists";
import { useState } from "react";
import RouteModal from "@/app/components/modal/RouteModal";

export default function page() {
  const router = useRouter();
  const { playlists, loading, error, deletePlaylist } = usePlaylists();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);

  const handleDeleteClick = (playlistId: string) => {
    setPlaylistToDelete(playlistId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (playlistToDelete) {
      try {
        await deletePlaylist(playlistToDelete);
        setDeleteModalOpen(false);
        setPlaylistToDelete(null);
      } catch (err) {
        alert("플레이리스트 삭제에 실패했습니다.");
      }
    }
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setPlaylistToDelete(null);
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
                    id={playlist.id}
                    title={playlist.title}
                    src={playlist.thumbnail || undefined}
                    onDelete={() => handleDeleteClick(playlist.id)}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <RouteModal
        isOpen={deleteModalOpen}
        onClose={handleCloseModal}
        message="삭제하면 되돌릴 수 없어요. 계속하시겠어요?"
        buttonText="네, 삭제할게요."
        targetRoute=""
        onAction={handleConfirmDelete}
      />
    </section>
  );
}
