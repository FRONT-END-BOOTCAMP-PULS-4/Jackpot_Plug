import axios from "axios";
import { NextResponse } from "next/server";

export class SearchYouTubeDirectlyUseCase {
  constructor(
    private baseUrl = process.env.NEXT_PUBLIC_YOUTUBE_API_URL_SEARCH,
    private apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  ) {}
  async execute(query: string): Promise<NextResponse> {
    try {
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
          q: query,
        },
      });

      const videoItems = response.data.items.filter(
        (item: any) => item.id && item.id.videoId
      );

      return NextResponse.json({
        items: videoItems,
        totalResults: videoItems.length,
        query,
      });
    } catch (error) {
      console.error("Error searching YouTube directly:", error);
      return NextResponse.json(
        { error: "Failed to fetch search results" },
        { status: 500 }
      );
    }
  }
}
