import { FormEvent, useState } from "react";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";

import { IconBtn } from "@/app/components/button/Buttons";
import SearchInput from "@/app/components/input/SearchInput";
import RouteModal from "@/app/components/modal/RouteModal";

import { useToast } from "@/hooks/useToast";
import useModal from "@/hooks/useModal";
import { getVideoId } from "@/utils/getYoutubeId";

interface VideoExtractorProps {
  defaultUrl?: string;
  size?: "default" | "small";
}

export default function VideoExtractor({
  defaultUrl = "",
  size = "default",
}: VideoExtractorProps) {
  const { showToast } = useToast();
  const routeModal = useModal();
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState(defaultUrl !== "" ? defaultUrl : ""); // 유튜브 영상 URL
  const [modalMessage, setModalMessage] = useState("모달 메세지"); // 모달 메시지

  const handleExtract = async (e: FormEvent) => {
    e.preventDefault();

    const videoId = getVideoId({ url: videoUrl, showToast });
    if (!videoId) return;

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

      sessionStorage.setItem(
        videoId,
        JSON.stringify({ ...data, videoUrl: videoUrl })
      );
      router.push(`/musics/${videoId}`);
    } catch (error) {
      console.error("Error fetching video description:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleExtract}>
        <SearchInput
          placeholder="추출하고 싶은 플레이리스트 링크를 입력하세요."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          size={size}
          buttonIcon={
            <IconBtn
              icon="plug"
              size={size === "small" ? "md" : "xl"}
              type="submit"
            />
          }
        />
      </form>
      <RouteModal
        isOpen={routeModal.isOpen}
        onClose={routeModal.close}
        buttonText="네, 검색하러 갈게요."
        targetRoute="/search"
        message={modalMessage}
      />
    </>
  );
}
