import { MusicRepository } from "@/domain/repositories/MusicRepository";
import { NextResponse } from "next/server";

export class YoutubeApiRepository implements MusicRepository {
  async fetchDescription(videoId: string): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_YOUTUBE_API_URL_VIDEOS;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const apiUrl = `${baseUrl}?&key=${apiKey}&part=snippet&id=${videoId}`;

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

    // 영상 설명이 없거나 비어있는 경우 - 기본값 설정
    const description = data?.items?.[0]?.snippet?.description.trim()
      ? data.items[0].snippet.description
      : "No description available";

    return description;
  }
}
