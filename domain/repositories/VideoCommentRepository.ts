import { VideoComment } from "../entities/VideoComment";

export interface VideoCommentRepository {
  fetchVideoComment(videoId: string): Promise<VideoComment>;
}
