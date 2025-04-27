import { create } from "zustand";
import { devtools, createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";

interface Music {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  isrc: string;
}

export interface Playlist {
  id: string;
  title: string;
  thumbnail: string | null;
}

interface PlaylistState {
  playlists: Playlist[];
  musics: Music[];
  loading: boolean;
  error: string | null;

  createPlaylist: (
    userId: string,
    playlistName: string,
    musics: Music[],
    isrcList: string[]
  ) => Promise<string>;
  addTracksToPlaylist: (
    playlistId: string,
    musics: Music[],
    isrcList: string[]
  ) => Promise<void>;
  fetchPlaylists: (userId: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  resetPlaylists: () => void;
}

// persist 미들웨어와 devtools 미들웨어를 함께 사용하여 상태 관리
export const usePlaylistStore = create<PlaylistState>()(
  devtools(
    persist(
      (set) => ({
        musics: [],
        playlists: [],
        loading: false,
        error: null,

        createPlaylist: async (userId, playlistName, musics, isrcList) => {
          try {
            set({ loading: true, error: null });

            const createRes = await axios.post("/api/playlist/create", {
              userId,
              playlistName,
              musics,
              isrcList,
            });

            const res = await axios.get("/api/playlist", {
              params: { userId },
            });

            set({ playlists: res.data, loading: false });

            return createRes.data.playlistId;
          } catch (err) {
            console.error("플레이리스트 생성 실패:", err);
            set({
              error:
                "플레이리스트 생성 실패: " +
                (err instanceof Error ? err.message : String(err)),
              loading: false,
            });
          }
        },

        addTracksToPlaylist: async (playlistId, musics, isrcList) => {
          try {
            set({ loading: true, error: null });

            await axios.post("/api/playlist/add", {
              playlistId,
              musics,
              isrcList,
            });

            set({ loading: false });
          } catch (err) {
            console.error("플레이리스트 트랙 추가 실패:", err);
            set({
              error:
                "플레이리스트 트랙 추가 실패: " +
                (err instanceof Error ? err.message : String(err)),
              loading: false,
            });
          }
        },

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
      }),
      {
        name: "playlist-storage",
        storage: createJSONStorage(() => localStorage),
      }
    ),
    { name: "PlaylistStore" }
  )
);
