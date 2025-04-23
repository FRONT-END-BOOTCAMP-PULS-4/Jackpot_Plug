import { Track } from "@/domain/entities/Track";

export interface SpotifyRepository {
  searchTracks(query: string): Promise<Track[]>;
}
