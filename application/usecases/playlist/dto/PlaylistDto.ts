import { Playlist } from "@/domain/entities/Playlist";

export class PlaylistDto {
  constructor(
    public id: string,
    public title: string,
    public thumbnail: string | null
  ) {}

  static fromDomain(playlist: Playlist): PlaylistDto {
    return new PlaylistDto(playlist.id, playlist.title, playlist.thumbnail);
  }

  static fromDomainArray(playlists: Playlist[]): PlaylistDto[] {
    return playlists.map((playlist) => PlaylistDto.fromDomain(playlist));
  }
}
