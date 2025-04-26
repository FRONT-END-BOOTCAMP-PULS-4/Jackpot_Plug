"use client";

import Modal from "@/app/components/modal/Modal";
import { AnimatePresence } from "motion/react";
import { MusicDto } from "@/application/usecases/musics/dto/Music.dto";

import usePlaylistSaveFunnel from "./usePlaylistSaveFunnel";
import ReviewStepContent from "./ReviewStepContent";
import SelectStepContent from "./SelectStepContent";
import CreateNewStepContent from "./CreatNewStepContent";

interface PlaylistSaveFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "extract" | "select";
  initialTracks: MusicDto[];
}

export default function PlaylistSaveFunnelModal({
  isOpen,
  onClose,
  mode,
  initialTracks,
}: PlaylistSaveFunnelModalProps) {
  const funnel = usePlaylistSaveFunnel(initialTracks, mode);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            funnel.resetFunnel();
          }}
          onAction={funnel.handleAction}
          size={funnel.step === "createNew" ? "sm" : "lg"}
          title={funnel.title}
          buttonTitle={funnel.buttonTitle}
        >
          {funnel.step === "review" && (
            <ReviewStepContent
              key={funnel.newSelection.join(",")}
              trackList={funnel.trackList}
              newSelection={funnel.newSelection}
              onToggle={funnel.handleAddMusic}
            />
          )}
          {funnel.step === "select" && (
            <SelectStepContent
              key={funnel.selectedPlaylistId}
              trackList={funnel.trackList}
              isSelect={funnel.isSelect}
              setIsSelect={funnel.setIsSelect}
              goToCreateNew={() => funnel.setStep("createNew")}
              setSelectedPlaylistId={funnel.setSelectedPlaylistId}
            />
          )}
          {funnel.step === "createNew" && (
            <CreateNewStepContent setPlaylistName={funnel.setPlaylistName} />
          )}
        </Modal>
      )}
    </AnimatePresence>
  );
}
