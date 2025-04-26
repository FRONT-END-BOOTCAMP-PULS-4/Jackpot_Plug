import Modal from "@/app/components/modal/Modal";
import { MusicDto } from "@/application/usecases/musics/dto/Music.dto";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { FunnelStep, stepConfig } from "./stepConfig";
import ListItem from "@/app/components/list/ListItem";
import { sortByOriginalOrder, toggleSelection } from "@/utils/musicUtils";
import TextInput from "@/app/components/input/TextInput";

import styles from "./PlaylistSaveFunnelModal.module.scss";

interface playlistSaveFunnelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "extract" | "search";
  initialTracks: MusicDto[];
}

export default function PlaylistSaveFunnelModal({
  isOpen,
  onClose,
  mode,
  initialTracks,
}: //   onComplete,
playlistSaveFunnelProps) {
  const [step, setStep] = useState<FunnelStep>(
    mode === "extract" ? "review" : "select"
  );
  const [trackList, setTrackList] = useState(initialTracks);
  const initialSelection = initialTracks.map((track) => track.isrc);
  const [newSelection, setNewSelection] = useState(initialSelection);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

  const [isSelect, setIsSelect] = useState(false);

  const [playlistName, setPlaylistName] = useState("");

  useEffect(() => {
    setTrackList(initialTracks);
  }, [initialTracks]);

  const PlaylistSaveModal = Modal;

  const { title, buttonTitle } = stepConfig[step];

  console.log("1. initialTracks", initialTracks);
  console.log("2. trackList", trackList);
  console.log("3. initialSelection", initialSelection);

  const resetFunnel = () => {
    setStep("review");
    setTrackList(initialTracks);
    setNewSelection(initialSelection);
    setIsSelect(false);
    setPlaylistName("");
  };

  const handleAddMusic = (isrc: string) => {
    setNewSelection((prev) => toggleSelection(prev, isrc));
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <PlaylistSaveModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            resetFunnel();
          }}
          onAction={() => {
            if (step === "review") {
              console.log("플리 확인 오키");

              console.log("4. selectedMusicList", newSelection);

              const sorted = sortByOriginalOrder(
                initialSelection,
                newSelection
              );

              console.log("5. sorted", sorted);

              const filteredTrackList = sorted
                .map((isrc) => trackList.find((track) => track.isrc === isrc))
                .filter((t): t is MusicDto => !!t);

              console.log("6. ----filteredTrackList----", filteredTrackList);
              setTrackList(filteredTrackList);

              if (filteredTrackList.length === 0) {
                alert("추가할 곡이 없습니다.");
                resetFunnel();
                return;
              }

              setStep("select");
            } else if (step === "select") {
              console.log("trackList", trackList);
              console.log("눌렀지롱");
              console.log("selectedPlaylistId", selectedPlaylistId);
              // handleSave(); // playlistId로 저장
              // PlaylistSaveModal.close();
            } else if (step === "createNew") {
              console.log("새로운 거 만들거지롱");
              console.log("playlistName", playlistName);
              console.log(playlistName.length);
              // createPlaylist(); // 생성 후 저장
              // PlaylistSaveModal.close();
            }
          }}
          size={step === "createNew" ? "sm" : "lg"}
          title={title}
          buttonTitle={buttonTitle}
        >
          {step === "review" && (
            <ul className={styles.track_list_container}>
              {trackList.map((track) => (
                <ListItem
                  mode="edit"
                  key={track.isrc}
                  title={track.title}
                  artist={track.channelTitle}
                  thumbnailSrc={track.thumbnail}
                  onSelectToggle={() => handleAddMusic(track.isrc)}
                  isSelected={newSelection.includes(track.isrc)}
                />
              ))}
            </ul>
          )}
          {step === "select" && (
            <ul className={styles.playlists_container}>
              <li className={styles.playlist_item}>
                <button
                  onClick={() => {
                    setStep("createNew");
                  }}
                >
                  + New Playlist
                </button>
              </li>
              {/* 플레이리스트 항목 뿌리기 */}
              <li
                className={`${styles.playlist_item} 
                ${isSelect ? styles.selected : ""}`}
                onClick={() => {
                  setIsSelect((current) => !current);
                  setSelectedPlaylistId(trackList[0].title);
                }}
              >
                {trackList[0].title}
              </li>
            </ul>
          )}
          {step === "createNew" && (
            <div className={styles.create_new_container}>
              <div className={styles.create_new_title}>새 리스트 제목</div>
              <form>
                <TextInput
                  placeholder="플레이리스트 이름을 작성해주세요. (최대 50자)"
                  label="playlistName"
                  maxLength={50}
                  setChangeText={setPlaylistName}
                />
              </form>
            </div>
          )}
        </PlaylistSaveModal>
      )}
    </AnimatePresence>
  );
}
