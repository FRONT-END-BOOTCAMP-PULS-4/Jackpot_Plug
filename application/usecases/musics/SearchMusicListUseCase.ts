import { NextResponse } from "next/server";
import { SearchSpotifyTracksUseCase } from "../search/SearchSpotifyTracksUseCase";
import { SearchYouTubeByIsrcUseCase } from "../search/SearchYouTubeByIsrcUseCase";
import { matchTracks } from "@/utils/matchTracks";
import { SpotifyAPiRepository } from "@/infra/repositories/spotify/SpotifyApiRepository";
import { SearchMusicDto } from "./dto/SearchMusic.dto";
import { formatDuration } from "@/utils/formatDuration";

export class SearchMusicListUseCase {
  constructor(
    private spotifySearchUseCase = new SearchSpotifyTracksUseCase(
      new SpotifyAPiRepository()
    ),
    private youtubeIsrcSearchUseCase = new SearchYouTubeByIsrcUseCase()
  ) {}
  async execute(
    musiclists: string[]
  ): Promise<SearchMusicDto[] | NextResponse> {
    try {
      if (!musiclists) {
        return NextResponse.json(
          { error: "Query parameter 'q' is required" },
          { status: 400 }
        );
      }

      // 1. Spotify에서 트랙 검색
      const spotifyTracks = await Promise.all(
        musiclists.map((musiclist) =>
          this.spotifySearchUseCase.execute(musiclist)
        )
      );

      // Spotify 검색 결과가 없는 경우
      if (!spotifyTracks.length) {
        throw new Error("NoSpotifyTracks");
      }

      // 2. Spotify 트랙에서 ISRC 코드 추출
      const isrcCodes = spotifyTracks
        .flat()
        .filter((track) => track.isrc)
        .map((track) => track.isrc as string);

      // ISRC 코드가 없는 경우
      if (!isrcCodes.length) {
        throw new Error("NoISRC");
      }

      // 3. ISRC 코드로 YouTube 검색 - 서버 저장된 코드 검색 수 없으면 진행 _ 추가 예정
      const youtubeResults = await this.youtubeIsrcSearchUseCase.execute(
        isrcCodes
      );

      // 매칭 함수 적용
      const matchedResults = spotifyTracks.map((tracks) =>
        matchTracks(youtubeResults, tracks)
      );

      return matchedResults.flat().map((item) => ({
        videoId: item.id?.videoId,
        title: item.snippet?.title,
        channelTitle: item.snippet?.channelTitle,
        duration: formatDuration(item.snippet?.duration),
        thumbnail:
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.medium?.url ??
          item.snippet?.thumbnails?.default?.url ??
          "",
        isrc: item.matchedTrack?.isrc,
      }));
    } catch (error) {
      console.error("Error fetching search results:", error);
      return NextResponse.json(
        { error: "Failed to fetch search results" },
        { status: 500 }
      );
    }
  }
}
