// 영상 설명을 가져오고 타임라인을 추출하는 유스케이스
import { VideoRepository } from "@/domain/repositories/VideoRepository";
import { YoutubeApiRepository } from "@/infra/repositories/youtube/VideoReposiroty";
import { Video } from "./dto/Video.dto";
import { extractTimeline } from "@/utils/extractTimeline";
import { formatDuration } from "@/utils/formatDuration";

const videoRepo: VideoRepository = new YoutubeApiRepository();

export async function getVideoInfoUseCase(videoId: string): Promise<Video> {
  const { title, channelTitle, thumbnail, duration, description } =
    await videoRepo.fetchVideoData(videoId);

  if (!description || description === "No description available") {
    throw new Error("NoDescription");
  }

  const musicList = extractTimeline(description);
  const videoDuration = formatDuration(duration);

  if (musicList.length === 0) {
    throw new Error("NoMusicItem");
  }

  return {
    title,
    channelTitle,
    thumbnail,
    duration: videoDuration,
    musicList: musicList,
  };
}
