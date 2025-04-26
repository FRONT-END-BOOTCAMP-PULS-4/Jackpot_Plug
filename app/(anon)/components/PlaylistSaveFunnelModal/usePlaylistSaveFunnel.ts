import { useState, useEffect } from "react";
import { FunnelStep, stepConfig } from "./stepConfig";
import { sortByOriginalOrder, toggleSelection } from "@/utils/musicUtils";
import { MusicDto } from "@/application/usecases/musics/dto/Music.dto";

export default function usePlaylistSaveFunnel(
  initialTracks: MusicDto[],
  mode: "extract" | "select"
) {
  const [step, setStep] = useState<FunnelStep>(
    mode === "extract" ? "review" : "select"
  );
  const [trackList, setTrackList] = useState(initialTracks);
  const initialSelection = initialTracks.map((track) => track.isrc);
  const [newSelection, setNewSelection] = useState(initialSelection);
  const [isSelect, setIsSelect] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");

  useEffect(() => {
    setTrackList(initialTracks);
  }, [initialTracks]);

  const resetFunnel = () => {
    setStep("review");
    setTrackList(initialTracks);
    setNewSelection(initialSelection);
    setIsSelect(false);
    setSelectedPlaylistId("");
    setPlaylistName("");
  };

  const handleAddMusic = (isrc: string) => {
    setNewSelection((prev) => toggleSelection(prev, isrc));
  };

  const handleAction = () => {
    if (step === "review") {
      //   const sorted = sortByOriginalOrder(initialSelection, newSelection);
      //   const filteredTrackList = sorted
      //     .map((isrc) => trackList.find((track) => track.isrc === isrc))
      //     .filter((t): t is MusicDto => !!t);

      //   setTrackList(filteredTrackList);

      //   if (filteredTrackList.length === 0) {
      //     alert("추가할 곡이 없습니다.");
      //     resetFunnel();
      //     return;
      //   }

      //   setStep("select");
      console.log("플리 확인 오키");

      console.log("4. selectedMusicList", newSelection);

      const sorted = sortByOriginalOrder(initialSelection, newSelection);

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
      console.log("🎯 기존 플레이리스트에 저장하는 로직");
      console.log("선택된 PlaylistId:", selectedPlaylistId);
      // TODO: 저장 API 호출 예정
    } else if (step === "createNew") {
      console.log("🆕 새 플레이리스트 생성하고 저장하는 로직");
      console.log("새 플레이리스트 이름:", playlistName);
      // TODO: 생성 + 저장 API 호출 예정
    }
  };

  return {
    step,
    setStep,
    trackList,
    newSelection,
    handleAddMusic,
    isSelect,
    setIsSelect,
    selectedPlaylistId,
    setSelectedPlaylistId,
    playlistName,
    setPlaylistName,
    resetFunnel,
    handleAction,
    title: stepConfig[step].title,
    buttonTitle: stepConfig[step].buttonTitle,
  };
}
