import { ToastType } from "@/store/toast";

interface YoutubeId {
  url: string;
  showToast: (msg: string, duration: number, toastType?: ToastType) => void;
}

export function getVideoId({ url, showToast }: YoutubeId): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "www.youtube.com" && urlObj.searchParams.has("v")) {
      //유튜브 원본 url
      return urlObj.searchParams.get("v");
    } else if (urlObj.hostname === "youtu.be") {
      //유튜브 공유링크
      return urlObj.pathname.slice(1);
    }
    showToast(
      "잘못된 YouTube URL 이에요, 올바른 URL을 입력해주세요.🥲",
      2000,
      "error"
    );
    return null;
  } catch (error) {
    showToast("잘못된 URL 형식이에요.🥲", 2000, "error");
    return null;
  }
}
