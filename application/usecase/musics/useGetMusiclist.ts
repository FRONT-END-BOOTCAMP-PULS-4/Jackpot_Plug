// 영상 설명을 가져오고 타임라인을 추출하는 유스케이스
import { MusicRepository } from "@/domain/repositories/MusicRepository";
import { YoutubeApiRepository } from "@/infra/repositories/youtube/videoReposiroty";
import { MusicItemDto } from "./dto/music.dto";
import { extractTimeline } from "@/utils/extractTimeline";

const videoRepo: MusicRepository = new YoutubeApiRepository();

export async function getMusiclistUseCase(
  videoId: string
): Promise<MusicItemDto[]> {
  const description = await videoRepo.fetchDescription(videoId);

  if (!description || description === "No description available") {
    throw new Error("NoDescription");
  }

  const MusicItems = extractTimeline(description);

  if (MusicItems.length === 0) {
    throw new Error("NoMusicItem");
  }

  return MusicItems;
}
