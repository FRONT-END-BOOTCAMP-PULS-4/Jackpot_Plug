import { MusicDto } from "@/application/usecases/musics/dto/Music.dto";
import ListItem from "@/app/components/list/ListItem";
import styles from "./styles.module.scss";

interface ReviewStepContentProps {
  trackList: MusicDto[];
  newSelection: string[];
  onToggle: (isrc: string) => void;
}

export default function ReviewStepContent({
  trackList,
  newSelection,
  onToggle,
}: ReviewStepContentProps) {
  return (
    <ul className={styles.track_list_container}>
      {trackList.map((track) => (
        <ListItem
          mode="edit"
          key={track.isrc}
          title={track.title}
          artist={track.channelTitle}
          thumbnailSrc={track.thumbnail}
          onSelectToggle={() => onToggle(track.isrc)}
          isSelected={newSelection.includes(track.isrc)}
        />
      ))}
    </ul>
  );
}
