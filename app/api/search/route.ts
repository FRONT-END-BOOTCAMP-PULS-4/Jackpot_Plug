import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url); // 요청 URL을 파싱하여 URL 객체 생성
    const query = url.searchParams.get("q"); // 링크에서 "q" 파라미터 추출

    // 검색어가 없는 경우 에러 처리
    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // API 요청을 위한 URL 설정
    const baseUrl = process.env.NEXT_PUBLIC_YOUTUBE_API_URL_SEARCH;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const apiUrl = `${baseUrl}?key=${apiKey}&part=snippet&order=relevance&type=video&videoEmbeddable=true&maxResults=10&q=${encodeURIComponent(
      query
    )}`;

    // API 요청
    const response = await fetch(apiUrl);

    // 응답 상태 확인
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch search results" },
        { status: response.status }
      );
    }

    // 응답 데이터 파싱
    const data = await response.json();

    const videoItems = data.items.filter(
      (item: any) => item.id && item.id.videoId
    );

    return NextResponse.json({
      items: videoItems.slice(0, 5),
      totalResults: videoItems.length,
      query,
    });
  } catch (error) {
    console.error("Error fetching search results:", error);

    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
