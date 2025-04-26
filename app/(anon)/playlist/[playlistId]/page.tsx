"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import MusicPlayerItem from "@/app/components/player/MusicPlayerItem";
import ListItem from "@/app/components/list/ListItem";

export default function Page() {
  const router = useRouter();

  // 임시 데이터
  const currentMusic = {
    id: "1",
    title: "Meaning of you (너의 의미 (feat. 김창완))",
    artist: "NewJeans",
    thumbnail: "/images/sample-image.png",
    videoId: "a3ICNMQW7Ok",
  };

  // 임시 음악 데이터
  const musicList = [
    { id: "1", title: "Ditto", artist: "NewJeans" },
    { id: "2", title: "Hype Boy", artist: "NewJeans" },
    { id: "3", title: "OMG", artist: "NewJeans" },
  ];

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
          <MusicPlayerItem
            title={currentMusic.title}
            artist={currentMusic.artist}
            src={currentMusic.thumbnail}
            videoId={currentMusic.videoId}
            isCertified={true}
            mode="list"
          />
        </div>

        <div className={styles.music_list}>
          <ul>
            {musicList.map((music) => (
              <ListItem
                key={music.id}
                title={music.title}
                artist={music.artist}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
