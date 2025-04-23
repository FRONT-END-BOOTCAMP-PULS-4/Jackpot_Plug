import { YouTubeResultDto } from "./dto/YouTubeResultDto";
import { YouTubeRepository } from "@/domain/repositories/YouTubeRepository";
import { YouTubeApiRepository } from "@/infra/repositories/youtube/YouTubeApiRepoitory";

export class SearchYouTubeByIsrcUseCase {
  constructor(
    private youtubeRepository: YouTubeRepository = new YouTubeApiRepository()
  ) {}

  async execute(isrcCodes: string[]): Promise<YouTubeResultDto[]> {
    const videos = await this.youtubeRepository.searchByIsrc(isrcCodes);
    return videos;
  }
}
