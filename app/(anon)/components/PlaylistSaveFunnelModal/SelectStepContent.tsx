import { Playlist } from "@/store/usePlaylistStore";
import styles from "./styles.module.scss";
import { MusicDto } from "@/application/usecases/musics/dto/Music.dto";
import { Dispatch, SetStateAction } from "react";

interface SelectStepContentProps {
  playlists: Playlist[];
  trackList: MusicDto[];
  selectedPlaylistId: string;
  setSelectedPlaylistId: Dispatch<SetStateAction<string>>;
  goToCreateNew: () => void;
}

export default function SelectStepContent({
  selectedPlaylistId,
  setSelectedPlaylistId,
  goToCreateNew,
  playlists,
}: SelectStepContentProps) {
  const handleSelectPlaylist = (playlistId: string) => {
    setSelectedPlaylistId((currentId) =>
      currentId === playlistId ? "" : playlistId
    );
  };

  return (
    <ul className={styles.playlists_container}>
      <li className={styles.playlist_item}>
        <button onClick={goToCreateNew}>+ New Playlist</button>
      </li>
      {playlists.map((playlist) => (
        <li
          key={playlist.id}
          className={`${styles.playlist_item} ${
            selectedPlaylistId === playlist.id ? styles.selected : ""
          }`}
          onClick={() => handleSelectPlaylist(playlist.id)}
        >
          {playlist.title}
        </li>
      ))}
    </ul>
  );
}
