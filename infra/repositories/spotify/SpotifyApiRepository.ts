import { Track } from "@/domain/entities/Track";
import { SpotifyRepository } from "@/domain/repositories/SpotifyRepository";
import { createAxiosInstance } from "./ApiClient";

export class SpotifyAPiRepository implements SpotifyRepository {
  async searchTracks(query: string): Promise<Track[]> {
    try {
      const axiosInstance = await createAxiosInstance();

      const { data } = await axiosInstance.get("/search", {
        params: {
          q: query,
          type: "track",
          limit: 1,
        },
      });

      return data.tracks.items.map(
        (track: any) =>
          new Track(
            track.id,
            track.name,
            track.artists[0].name,
            track.external_ids?.isrc,
            track.album.name,
            track.album.images[0]?.url
          )
      );
    } catch (error) {
      console.error("Error searching Spotify:", error);
      return [];
    }
  }
}
