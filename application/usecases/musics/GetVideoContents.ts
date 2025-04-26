// 영상 설명을 가져오고 타임라인을 추출하는 유스케이스
import { VideoRepository } from "@/domain/repositories/VideoRepository";
import { Video } from "./dto/Video.dto";
import { extractTimeline } from "@/utils/extractTimeline";
import { formatDuration } from "@/utils/formatDuration";
import { VideoCommentRepository } from "@/domain/repositories/VideoCommentRepository";

export class GetVideoInfoUseCase {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly commentRepository: VideoCommentRepository
  ) {}

  async execute(videoId: string): Promise<Video> {
    const { title, channelTitle, thumbnail, duration, description } =
      await this.videoRepository.fetchVideoData(videoId);

    if (!description || description === "No description available") {
      throw new Error("NoDescription");
    }

    let musicList = extractTimeline(description);
    const videoDuration = formatDuration(duration);

    if (musicList.length === 0) {
      const pinnedComment = await this.commentRepository.fetchVideoComment(
        videoId
      );
      musicList = extractTimeline(pinnedComment.comment);

      if (musicList.length === 0) {
        throw new Error("NoMusicItem");
      }
    }

    return {
      title,
      channelTitle,
      thumbnail,
      duration: videoDuration,
      musicList: musicList,
    };
  }
}
