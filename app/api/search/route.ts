import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/utils/spotify";
import { matchTracks } from "@/utils/metchTracks";
import axios from "axios";

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  isrc?: string;
  album: string;
  image?: string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");
    console.log("서버에서 받은 검색어:", query);

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    console.log("Spotify 검색 시작...");
    const spotifyTracks = await searchSpotifyTracks(query);
    console.log(
      "Spotify 검색 결과:",
      spotifyTracks.map(
        (t) => `${t.name} by ${t.artist} (ISRC: ${t.isrc || "None"})`
      )
    );

    if (!spotifyTracks.length) {
      console.log("스포티파이 결과 없음, 유튜브 직접 검색으로 전환");
      return searchYouTubeDirectly(query);
    }

    // 2. Spotify 트랙에서 ISRC 코드 추출
    const isrcCodes = spotifyTracks
      .filter((track) => track.isrc)
      .map((track) => track.isrc as string);
    console.log("추출된 ISRC 코드:", isrcCodes);

    if (!isrcCodes.length) {
      console.log("ISRC 코드 없음, YouTube 직접 검색으로 전환");
      return searchYouTubeDirectly(query);
    }

    // 3. ISRC 코드로 YouTube 검색
    console.log("ISRC 코드로 YouTube 검색 시작...");
    const youtubeResults = await searchYouTubeByIsrc(isrcCodes);
    console.log(
      "YouTube 검색 결과:",
      youtubeResults.map((item: any) => item.snippet)
    );

    // 매칭 함수 적용
    const matchedResults = matchTracks(youtubeResults, spotifyTracks);

    return NextResponse.json({
      items: youtubeResults,
      totalResults: matchedResults.length || youtubeResults.length,
      query,
      spotifyTracks: spotifyTracks,
    });
  } catch (error) {
    console.error("Error fetching search results:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}

// Spotify에서 트랙 검색 함수
async function searchSpotifyTracks(query: string): Promise<SpotifyTrack[]> {
  try {
    const token = await getSpotifyAccessToken();
    const spotifyBaseUrl = process.env.NEXT_PUBLIC_SPOTIFY_API_BASEURL;

    const response = await axios({
      method: "get",
      url: `${spotifyBaseUrl}/search`,
      params: {
        q: query,
        type: "track",
        limit: 1,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      isrc: track.external_ids?.isrc,
      album: track.album.name,
      image: track.album.images[0]?.url,
    }));
  } catch (error) {
    console.error("Error searching Spotify:", error);
    return [];
  }
}

// ISRC 코드로 YouTube 검색
async function searchYouTubeByIsrc(isrcCodes: string[]): Promise<any[]> {
  try {
    const isrcQuery = isrcCodes.join(" OR ");

    const baseUrl = process.env.NEXT_PUBLIC_YOUTUBE_API_URL_SEARCH;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

    const response = await axios({
      method: "get",
      url: baseUrl,
      params: {
        key: apiKey,
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

// 직접 YouTube 검색 (ISRC 없을 때 대체 방법)
async function searchYouTubeDirectly(query: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_YOUTUBE_API_URL_SEARCH;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

    const response = await axios({
      method: "get",
      url: baseUrl,
      params: {
        key: apiKey,
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
