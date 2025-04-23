import axios from "axios";
import { getSpotifyAccessToken } from "@/utils/spotify";
import { SpotifyTrackDto } from "./dto/SpotifyTrackDto";

export class SearchSpotifyTracksUseCase {
  constructor(
    private spotifyBaseUrl: string = process.env
      .NEXT_PUBLIC_SPOTIFY_API_BASEURL || ""
  ) {}
  async execute(query: string): Promise<SpotifyTrackDto[]> {
    try {
      const token = await getSpotifyAccessToken();

      const response = await axios({
        method: "get",
        url: `${this.spotifyBaseUrl}/search`,
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
}
