import { NextResponse } from "next/server";
import { YouTubeRepository } from "@/domain/repositories/YouTubeRepository";
import { YouTubeVideo } from "@/domain/entities/YouTubeVideo";
import { axiosInstance } from "./ApiClient";

export class YouTubeApiRepository implements YouTubeRepository {
  async searchByIsrc(isrcCodes: string[]): Promise<YouTubeVideo[]> {
    try {
      const isrcQuery = isrcCodes.join(" OR ");

      const { data } = await axiosInstance.get("/search", {
        params: {
          part: "snippet",
          order: "relevance",
          type: "video",
          videoEmbeddable: "true",
          maxResults: isrcCodes.length,
          q: isrcQuery,
        },
      });

      console.log("유튜브데이터:", data);
      return data.items
        .filter((item: any) => item.id && item.id.videoId)
        .map(
          (item: any) =>
            new YouTubeVideo(
              { videoId: item.id.videoId },
              {
                title: item.snippet.title,
                description: item.snippet.description,
                channelTitle: item.snippet.channelTitle,
                thumbnails: item.snippet.thumbnails,
              }
            )
        );
    } catch (error) {
      console.error("Error searching YouTube by ISRC:", error);
      return [];
    }
  }

  async searchDirectly(query: string): Promise<NextResponse> {
    try {
      const { data } = await axiosInstance.get("/search", {
        params: {
          part: "snippet",
          order: "relevance",
          type: "video",
          videoEmbeddable: "true",
          maxResults: 1,
          q: query,
        },
      });

      const videoItems = data.items.filter(
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
