import { Track } from "@/domain/entities/Track";
export class SpotifyTrackDto {
  constructor(
    public id: string,
    public name: string,
    public artist: string,
    public album?: string,
    public isrc?: string,
    public image?: string
  ) {}
  static fromDomain(track: Track): SpotifyTrackDto {
    return new SpotifyTrackDto(
      track.id,
      track.name,
      track.artist,
      track.album || "",
      track.isrc,
      track.imageUrl
    );
  }

  static fromDomainArray(tracks: Track[]): SpotifyTrackDto[] {
    return tracks.map((track) => SpotifyTrackDto.fromDomain(track));
  }
}
