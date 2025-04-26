import styles from "./styles.module.scss";
import { MusicDto } from "@/application/usecases/musics/dto/Music.dto";

interface SelectStepContentProps {
  trackList: MusicDto[];
  isSelect: boolean;
  setIsSelect: (v: boolean) => void;
  setSelectedPlaylistId: (id: string) => void;
  goToCreateNew: () => void;
}

export default function SelectStepContent({
  trackList,
  isSelect,
  setIsSelect,
  setSelectedPlaylistId,
  goToCreateNew,
}: SelectStepContentProps) {
  return (
    <ul className={styles.playlists_container}>
      <li className={styles.playlist_item}>
        <button onClick={goToCreateNew}>+ New Playlist</button>
      </li>
      <li
        className={`${styles.playlist_item} ${isSelect ? styles.selected : ""}`}
        onClick={() => {
          setIsSelect(!isSelect);
          setSelectedPlaylistId(trackList[0].title); // 예시
        }}
      >
        {trackList[0].title}
      </li>
    </ul>
  );
}
