import axios from "axios";

// 곡 정보 인터페이스
interface SongInfo {
  title: string;
  artist: string;
  isrc?: string;
}

// API 응답 인터페이스
interface FetchSongsByIsrcResponse {
  songs: SongInfo[];
  isrcList: string[];
  youtubeSearchQuery: string;
}

// YouTube 검색 결과 인터페이스
interface YouTubeSearchResult {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

interface YouTubeSearchResponse {
  results: YouTubeSearchResult[];
  totalResults: number;
  nextPageToken: string | null;
}

type FetchSongsByIsrcParams = {
  videoId?: string;
  extractedSongs?: SongInfo[];
};

/**
 * 유튜브 영상에서 추출한 곡 정보로 Spotify ISRC 코드를 조회하고,
 * YouTube 검색 쿼리를 생성하는 함수
 *
 * @param params 영상 ID 또는 추출된 곡 정보 리스트
 * @returns 곡 정보, ISRC 목록, YouTube 검색 쿼리
 */
export async function fetchSongsByIsrc(
  params: FetchSongsByIsrcParams
): Promise<FetchSongsByIsrcResponse> {
  try {
    const response = await axios({
      method: "POST",
      url: "/api/fetch-songs-by-isrc",
      headers: {
        "Content-Type": "application/json",
      },
      data: params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching songs by ISRC:", error);
    throw error;
  }
}

/**
 * YouTube 검색 URL을 생성하는 함수
 *
 * @param isrcQuery ISRC 쿼리 문자열
 * @returns YouTube 검색 URL
 */
export function createYouTubeSearchUrl(isrcQuery: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    isrcQuery
  )}`;
}

/**
 * YouTube Data API를 사용하여 비디오 검색 결과를 가져오는 함수
 *
 * @param query 검색어 (ISRC 코드 OR로 연결된 문자열)
 * @returns 검색 결과 목록
 */
export async function searchYouTubeVideos(
  query: string
): Promise<YouTubeSearchResponse> {
  try {
    const response = await axios.get("/api/youtube-search", {
      params: {
        q: query,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    throw error;
  }
}

/**
 * 유튜브 영상 ID에서 곡 정보를 추출하고 검색 URL을 생성하는 헬퍼 함수
 *
 * @param videoId YouTube 영상 ID
 * @returns YouTube 검색 URL과 추출된 곡 정보
 */
export async function createSearchUrlFromVideoId(
  videoId: string
): Promise<{ searchUrl: string; songs: SongInfo[] }> {
  const result = await fetchSongsByIsrc({ videoId });
  const searchUrl = createYouTubeSearchUrl(result.youtubeSearchQuery);

  return {
    searchUrl,
    songs: result.songs,
  };
}

/**
 * 유튜브 영상 ID에서 곡 정보를 추출하고 YouTube API를 통해 검색 결과를 가져오는 함수
 *
 * @param videoId YouTube 영상 ID
 * @returns YouTube 검색 결과와 추출된 곡 정보
 */
export async function searchVideosByIsrcFromYouTubeId(
  videoId: string
): Promise<{
  searchResults: YouTubeSearchResult[];
  songs: SongInfo[];
  totalResults: number;
}> {
  // 1. 영상에서 곡 정보 추출하고 ISRC 코드 가져오기
  const isrcResult = await fetchSongsByIsrc({ videoId });

  // 2. ISRC 코드가 있는 경우 YouTube API로 검색
  if (isrcResult.isrcList.length > 0) {
    const searchQuery = isrcResult.youtubeSearchQuery;
    const searchResults = await searchYouTubeVideos(searchQuery);

    return {
      searchResults: searchResults.results,
      songs: isrcResult.songs,
      totalResults: searchResults.totalResults,
    };
  }

  // ISRC 코드가 없는 경우 빈 결과 반환
  return {
    searchResults: [],
    songs: isrcResult.songs,
    totalResults: 0,
  };
}

export type { SongInfo, FetchSongsByIsrcResponse, YouTubeSearchResult };
