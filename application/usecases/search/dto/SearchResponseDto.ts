import { SpotifyTrackDto } from "./SpotifyTrackDto";
import { YouTubeResultDto } from "./YouTubeResultDto";

export class SearchResponseDto {
  constructor(
    public items: YouTubeResultDto[],
    public totalResults: number,
    public query: string,
    public spotifyTracks?: SpotifyTrackDto[],
    public error?: string
  ) {}
}
