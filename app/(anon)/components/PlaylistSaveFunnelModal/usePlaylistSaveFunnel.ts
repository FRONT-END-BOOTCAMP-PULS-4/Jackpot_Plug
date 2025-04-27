"use client";
import { useState, useEffect, useMemo } from "react";
import { FunnelStep, stepConfig } from "./stepConfig";
import { sortByOriginalOrder, toggleSelection } from "@/utils/musicUtils";
import { MusicDto } from "@/application/usecases/musics/dto/Music.dto";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

export default function usePlaylistSaveFunnel(
  initialTracks: MusicDto[],
  mode: "extract" | "select",
  userId: string,
  onClose: () => void,
  router: ReturnType<typeof useRouter>
) {
  const [step, setStep] = useState<FunnelStep>(
    mode === "extract" ? "review" : "select"
  );
  const [trackList, setTrackList] = useState(initialTracks);
  const [newSelection, setNewSelection] = useState(
    initialTracks.map((track) => track.isrc)
  );
  const [isSelect, setIsSelect] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const { createPlaylist, addTracksToPlaylist } = usePlaylistStore();
  const { showToast } = useToast();

  const initialSelection = useMemo(
    () => initialTracks.map((track) => track.isrc),
    [initialTracks]
  );

  useEffect(() => {
    setTrackList(initialTracks);
    setNewSelection(initialSelection);
  }, [initialTracks, initialSelection]);

  const resetFunnel = () => {
    setStep("review");
    setTrackList(initialTracks);
    setNewSelection(initialSelection);
    setIsSelect(false);
    setSelectedPlaylistId("");
    setPlaylistName("");
    onClose();
  };

  const handleAddMusic = (isrc: string) => {
    setNewSelection((prev) => toggleSelection(prev, isrc));
  };

  const handleCreatePlaylist = async () => {
    try {
      const playlistId = await createPlaylist(
        userId,
        playlistName,
        trackList,
        newSelection
      );
      resetFunnel();
      showToast("플레이리스트 저장 완료!", 2000, "success");
      setTimeout(() => router.push(`/playlist/${playlistId}`), 1000);
    } catch (error) {
      resetFunnel();
      console.error("플레이리스트 저장 실패:", error);
      showToast("저장 중 오류가 발생했습니다.", 2000, "error");
    }
  };

  const handleAddPlaylist = async () => {
    try {
      await addTracksToPlaylist(selectedPlaylistId, trackList, newSelection);
      resetFunnel();
      showToast("플레이리스트 저장 완료!", 2000, "success");
      setTimeout(() => router.push(`/playlist/${selectedPlaylistId}`), 1000);
    } catch (error) {
      resetFunnel();
      console.error("플레이리스트 저장 실패:", error);
      showToast("저장 중 오류가 발생했습니다.", 2000, "error");
    }
  };

  const handleAction = async () => {
    if (step === "review") {
      const sorted = sortByOriginalOrder(initialSelection, newSelection);

      const filteredTrackList = sorted
        .map((isrc) => trackList.find((track) => track.isrc === isrc))
        .filter((t): t is MusicDto => !!t);

      setTrackList(filteredTrackList);

      if (filteredTrackList.length === 0) {
        showToast(
          "저장할 노래가 없어요😅 1개 이상의 곡을 선택해주세요.",
          2000,
          "error"
        );
        resetFunnel();
        return;
      }

      setStep("select");
    } else if (step === "select") {
      await handleAddPlaylist();
    } else if (step === "createNew") {
      await handleCreatePlaylist();
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
