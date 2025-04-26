import { SpotifyRepository } from "@/domain/repositories/SpotifyRepository";
import { SpotifyTrackDto } from "./dto/SpotifyTrackDto";
import { SpotifyAPiRepository } from "@/infra/repositories/spotify/SpotifyApiRepository";

export class SearchSpotifyTracksUseCase {
  constructor(
    private spotifyRepository: SpotifyRepository = new SpotifyAPiRepository()
  ) {}

  async execute(query: string): Promise<SpotifyTrackDto[]> {
    const tracks = await this.spotifyRepository.searchTracks(query);

    return tracks.map(
      (track) =>
        new SpotifyTrackDto(
          track.id,
          track.name,
          track.artist,
          track.album,
          track.isrc,
          track.imageUrl
        )
    );
  }
}
