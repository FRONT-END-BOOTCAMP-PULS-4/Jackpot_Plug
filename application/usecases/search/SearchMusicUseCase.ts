import { NextResponse } from "next/server";
import { SearchSpotifyTracksUseCase } from "./SearchSpotifyTracksUseCase";
import { SearchYouTubeByIsrcUseCase } from "./SearchYouTubeByIsrcUseCase";
import { SearchYouTubeDirectlyUseCase } from "./SearchYouTubeDirectlyUseCase";
import { matchTracks } from "@/utils/matchTracks";
import { SpotifyAPiRepository } from "@/infra/repositories/spotify/SpotifyApiRepository";

export class SearchMusicUseCase {
  constructor(
    private spotifySearchUseCase = new SearchSpotifyTracksUseCase(
      new SpotifyAPiRepository()
    ),
    private youtubeIsrcSearchUseCase = new SearchYouTubeByIsrcUseCase(),
    private youtubeDirectSearchUseCase = new SearchYouTubeDirectlyUseCase()
  ) {}
  async execute(query: string): Promise<NextResponse> {
    try {
      if (!query) {
        return NextResponse.json(
          { error: "Query parameter 'q' is required" },
          { status: 400 }
        );
      }

      // 1. Spotify에서 트랙 검색
      const spotifyTracks = await this.spotifySearchUseCase.execute(query);

      // Spotify 검색 결과가 없는 경우 YouTube 직접 검색
      if (!spotifyTracks.length) {
        return this.youtubeDirectSearchUseCase.execute(query);
      }

      // 2. Spotify 트랙에서 ISRC 코드 추출
      const isrcCodes = spotifyTracks
        .filter((track) => track.isrc)
        .map((track) => track.isrc as string);

      // ISRC 코드가 없는 경우 YouTube 직접 검색
      if (!isrcCodes.length) {
        return this.youtubeDirectSearchUseCase.execute(query);
      }

      // 3. ISRC 코드로 YouTube 검색
      const youtubeResults = await this.youtubeIsrcSearchUseCase.execute(
        isrcCodes
      );

      youtubeResults.forEach((item) => {
        item.snippet.channelTitle = item.snippet.channelTitle.replace(
          " - Topic",
          ""
        );
      });

      // 매칭 함수 적용
      const matchedResults = matchTracks(youtubeResults, spotifyTracks);

      // console.log(isrcCodes, matchedResults, youtubeResults);

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
}
