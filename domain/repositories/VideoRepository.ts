import { Video } from "../entities/Video";

export interface VideoRepository {
  fetchVideoData(videoId: string): Promise<Video>;
}
