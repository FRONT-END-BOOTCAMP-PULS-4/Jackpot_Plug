import { VideoRepository } from "@/domain/repositories/VideoRepository";
import { NextResponse } from "next/server";

export class YoutubeApiRepository implements VideoRepository {
  async fetchVideoData(videoId: string): Promise<{
    title: string;
    channelTitle: string;
    thumbnail: string;
    duration: string;
    description: string;
  }> {
    const baseUrl = process.env.NEXT_PUBLIC_YOUTUBE_API_URL_VIDEOS;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const apiUrl = `${baseUrl}?&key=${apiKey}&part=snippet,contentDetails&id=${videoId}`;

    const response = await fetch(apiUrl);

    // API 요청 실패 시 에러 처리
    if (!response.ok) {
      throw NextResponse.json(
        { error: "Failed to fetch video data" },
        { status: response.status }
      );
    }

    // 응답 데이터 파싱
    const data = await response.json();

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
  }
}
