"use client";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.scss";
import MusicPlayerItem from "@/app/components/player/MusicPlayerItem";
import ListItem from "@/app/components/list/ListItem";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchPlaylistMusics = async () => {
      try {
        setLoading(true);
        setError(null);

        // 플레이리스트 정보 가져오기
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          const authData = JSON.parse(authStorage);
          const userId = authData.state.user?.id;

          if (userId) {
            try {
              const playlistResponse = await fetch(
                `/api/playlists?userId=${userId}`
              );

              // 응답 확인
              const contentType = playlistResponse.headers.get("content-type");
              if (
                !playlistResponse.ok ||
                !contentType?.includes("application/json")
              ) {
                console.warn("플레이리스트 목록을 가져오는데 실패했습니다.");
              } else {
                const playlists = await playlistResponse.json();
                const currentPlaylist = playlists.find(
                  (p: any) => p.id === playlistId
                );
                if (currentPlaylist) {
                  setPlaylistTitle(currentPlaylist.title);
                }
              }
            } catch (playlistError) {
              console.error("플레이리스트 정보 조회 실패:", playlistError);
            }
          }
        }
        // 플레이리스트 노래 목록 가져오기
        const res = await fetch(
          `/api/playlist-videos?playlistId=${playlistId}`
        );

        if (!res.ok) {
          throw new Error("플레이리스트 비디오를 불러오는데 실패했습니다.");
        }

        const data = await res.json();
        setPlaylistMusics(data);

        // 첫 번째 영상을 기본 선택
        if (data.length > 0) {
          setSelectedMusic(data[0]);
        }
      } catch (err) {
        console.error("플레이리스트 상세 조회 오류:", err);
        setError("플레이리스트를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylistMusics();
    }
  }, [playlistId]);

  const handleMusicSelect = (video: PlaylistMusic) => {
    setSelectedMusic(video);
  };

  return (
    <section className={styles.playlist_detail}>
      <button
        className={styles.back_btn}
        onClick={() => router.back()}
      >{`Playlists`}</button>
      <h2 className={styles.playlist_title}>
        Playlist 하루 끝, 봄바람과 함께 듣기 좋은 노래 모음
      </h2>

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
function setPlaylistTitle(title: any) {
  throw new Error("Function not implemented.");
}
