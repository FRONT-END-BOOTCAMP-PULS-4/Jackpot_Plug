import { useState, useEffect } from "react";
import axios from "axios";

export interface Playlist {
  id: string;
  title: string;
  thumbnail: string | null;
}

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const authStorage = localStorage.getItem("auth-storage");

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

        const res = await axios.get("/api/playlist", {
          params: { userId },
        });

        setPlaylists(res.data);
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

  return { playlists, loading, error };
}
