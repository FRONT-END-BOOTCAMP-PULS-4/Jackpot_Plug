import axios from "axios";
import { YouTubeResultDto } from "./dto/YouTubeResultDto";

export class SearchYouTubeByIsrcUseCase {
  constructor(
    private baseUrl: string = process.env.NEXT_PUBLIC_YOUTUBE_API_URL_SEARCH ||
      "",
    private apiKey: string = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ""
  ) {}

  async execute(isrcCodes: string[]): Promise<YouTubeResultDto[]> {
    try {
      const isrcQuery = isrcCodes.join(" OR ");

      const response = await axios({
        method: "get",
        url: this.baseUrl,
        params: {
          key: this.apiKey,
          part: "snippet",
          order: "relevance",
          type: "video",
          videoEmbeddable: "true",
          maxResults: 1,
          q: isrcQuery,
        },
      });

      console.log("유뷰트데이터:", response.data);
      return response.data.items.filter(
        (item: any) => item.id && item.id.videoId
      );
    } catch (error) {
      console.error("Error searching YouTube by ISRC:", error);
      return [];
    }
  }
}
