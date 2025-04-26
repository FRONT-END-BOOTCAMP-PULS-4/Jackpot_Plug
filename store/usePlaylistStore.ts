import { create } from "zustand";
import axios from "axios";

export interface Playlist {
  id: string;
  title: string;
  thumbnail: string | null;
}

interface PlaylistState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;

  fetchPlaylists: (userId: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  resetPlaylists: () => void;
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  playlists: [],
  loading: false,
  error: null,

  fetchPlaylists: async (userId: string) => {
    try {
      set({ loading: true, error: null });

      if (!userId) {
        set({ error: "사용자 ID를 찾을 수 없습니다", loading: false });
        return;
      }

      const res = await axios.get("/api/playlist", {
        params: { userId },
      });

      set({ playlists: res.data, loading: false });
    } catch (err) {
      set({
        error:
          "플레이리스트 조회 오류: " +
          (err instanceof Error ? err.message : String(err)),
        loading: false,
      });
    }
  },

  deletePlaylist: async (playlistId: string) => {
    try {
      await axios.delete(`/api/playlist/${playlistId}`);

      set((state) => ({
        playlists: state.playlists.filter(
          (playlist) => playlist.id !== playlistId
        ),
      }));
    } catch (err) {
      console.error("Failed to delete playlist:", err);
      throw err;
    }
  },

  resetPlaylists: () => {
    set({ playlists: [], loading: false, error: null });
  },
}));
