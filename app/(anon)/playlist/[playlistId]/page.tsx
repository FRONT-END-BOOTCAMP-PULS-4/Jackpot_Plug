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
    video_title: string;
    channel_id: string;
    thumbnail?: string;
  };
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const playlistId = params.playlistId as string;
  const [playlistMusics, setPlaylistMusics] = useState<PlaylistMusic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<PlaylistMusic | null>(
    null
  );
  const { fetchPlaylists, playlists } = usePlaylistStore();
  const [playlistTitle, setPlaylistTitle] = useState<string>("");

  useEffect(() => {
    const fetchPlaylistMusics = async () => {
      try {
        setLoading(true);
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
          setSelectedMusic(data[0]);
        }
      } catch (err) {
        console.error("플레이리스트 상세 조회 오류:", err);
        setError("플레이리스트 음악을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
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

  const handleMusicSelect = (music: PlaylistMusic) => {
    setSelectedMusic(music);
  };

  return (
    <section className={styles.playlist_detail}>
      <button
        className={styles.back_btn}
        onClick={() => router.back()}
      >{`Playlists`}</button>
      <h2 className={styles.playlist_title}>{playlistTitle}</h2>

      <div className={styles.content_container}>
        <div className={styles.music_player}>
          {selectedMusic && (
            <MusicPlayerItem
              title={selectedMusic.musics.video_title}
              artist={selectedMusic.musics.channel_id}
              src={selectedMusic.musics.thumbnail}
              videoId={selectedMusic.id}
              isCertified={true}
              mode="list"
            />
          )}
        </div>

        <div className={styles.music_list}>
          <ul>
            {playlistMusics.map((music) => (
              <ListItem
                key={music.id}
                title={music.musics.video_title}
                artist={music.musics.channel_id}
                thumbnailSrc={music.musics.thumbnail}
                onSelectToggle={() => handleMusicSelect(music)}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
