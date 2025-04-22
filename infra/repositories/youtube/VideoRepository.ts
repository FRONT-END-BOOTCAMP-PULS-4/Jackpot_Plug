import { VideoRepository } from "@/domain/repositories/VideoRepository";
import { NextResponse } from "next/server";
import { axiosInstance } from "./ApiClient";
import axios from "axios";

export class YoutubeVideoApiRepository implements VideoRepository {
  async fetchVideoData(videoId: string): Promise<{
    title: string;
    channelTitle: string;
    thumbnail: string;
    duration: string;
    description: string;
  }> {
    try {
      // 원본 비디오 정보
      const { data } = await axiosInstance.get("/videos", {
        params: {
          part: "snippet,contentDetails",
          id: videoId,
        },
      });

      const title = data?.items?.[0]?.snippet?.title ?? "";
      const channelTitle = data?.items?.[0]?.snippet?.channelTitle ?? "";
      const thumbnail =
        data?.items?.[0]?.snippet?.thumbnails?.standard?.url ?? "";
      const duration = data?.items?.[0]?.contentDetails?.duration ?? "";
      const description = data?.items?.[0]?.snippet?.description.trim()
        ? data.items[0].snippet.description
        : "No description available";

      return {
        title,
        channelTitle,
        thumbnail,
        duration,
        description,
      };
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw NextResponse.json(
          { error: "Failed to fetch video comments" },
          { status: error.response?.status || 500 }
        );
      } else {
        throw NextResponse.json(
          { error: "Unexpected server error" },
          { status: 500 }
        );
      }
    }
  }
}
