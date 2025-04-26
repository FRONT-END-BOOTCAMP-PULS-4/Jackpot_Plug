import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { useState } from "react";

import useModal from "@/hooks/useModal";

interface VideoExtractProps {
  videoUrl?: string;
  videoId: string;
  onSuccess?: (data: any) => void;
}

export const useVideoExtract = () => {
  const routeModal = useModal();
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState("모달 메세지");

  const extract = async ({
    videoId,
    videoUrl,
    onSuccess,
  }: VideoExtractProps) => {
    try {
      const response = await fetch(`/api/musics?id=${videoId}`);
      if (!response.ok) {
        throw NextResponse.json(
          { error: "Failed to fetch video description" },
          { status: response.status }
        );
      }

      const data = await response.json();

      if (data.error) {
        setModalMessage(data.error);
        routeModal.open();
        return;
      }

      const setUrl = videoUrl
        ? videoUrl
        : `https://www.youtube.com/watch?v=${videoId}`;

      const fullData = { ...data, videoUrl: setUrl };

      sessionStorage.setItem(videoId, JSON.stringify(fullData));
      onSuccess?.(fullData);

      if (window.location.pathname !== `/musics/${videoId}`) {
        router.push(`/musics/${videoId}`);
      }
    } catch (error) {
      console.error("Error fetching video description:", error);
    }
  };

  return {
    extract,
    modalMessage,
    routeModal,
  };
};
