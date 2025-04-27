import { PlaylistMusic } from "@/domain/entities/PlaylistMusic";

export class PlaylistMusicDto {
  constructor(
    public id: string,
    public ISRC: string,
    public videoId: string,
    public videoTitle: string,
    public channelId: string,
    public thumbnail?: string
  ) {}

  static fromDomain(playlistMusic: PlaylistMusic): PlaylistMusicDto {
    return new PlaylistMusicDto(
      playlistMusic.id,
      playlistMusic.ISRC,
      playlistMusic.videoId,
      playlistMusic.videoTitle,
      playlistMusic.channelId,
      playlistMusic.thumbnail
    );
  }

  static fromDomainArray(playlistMusics: PlaylistMusic[]): PlaylistMusicDto[] {
    return playlistMusics.map((music) => PlaylistMusicDto.fromDomain(music));
  }
}
