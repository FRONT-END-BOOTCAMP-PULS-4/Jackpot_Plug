import { FormEvent, useState } from "react";

import { IconBtn } from "@/app/components/button/Buttons";
import SearchInput from "@/app/components/input/SearchInput";
import RouteModal from "@/app/components/modal/RouteModal";

import { useToast } from "@/hooks/useToast";
import { getVideoId } from "@/utils/getYoutubeId";
import { useVideoExtract } from "@/hooks/useVideoExtract";

interface VideoExtractorProps {
  defaultUrl?: string;
  size?: "default" | "small";
}

export default function VideoExtractor({
  defaultUrl = "",
  size = "default",
}: VideoExtractorProps) {
  const { showToast } = useToast();
  const [videoUrl, setVideoUrl] = useState(defaultUrl !== "" ? defaultUrl : ""); // 유튜브 영상 URL

  const { extract, routeModal, modalMessage } = useVideoExtract();

  const handleExtract = async (e: FormEvent) => {
    e.preventDefault();

    const videoId = getVideoId({ url: videoUrl, showToast });
    if (!videoId) return;

    extract({ videoId, videoUrl });
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
