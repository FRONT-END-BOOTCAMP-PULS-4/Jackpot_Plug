import { Track } from "@/domain/entities/Track";
export class SpotifyTrackDto {
  constructor(
    public id: string,
    public name: string,
    public artist: string,
    public isrc: string,
    public album?: string,
    public image?: string
  ) {}
  static fromDomain(track: Track): SpotifyTrackDto {
    return new SpotifyTrackDto(
      track.id,
      track.name,
      track.artist,
      track.isrc,
      track.album || "",
      track.imageUrl
    );
  }

  static fromDomainArray(tracks: Track[]): SpotifyTrackDto[] {
    return tracks.map((track) => SpotifyTrackDto.fromDomain(track));
  }
}
