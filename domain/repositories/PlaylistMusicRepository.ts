import { PlaylistMusic } from "../entities/PlaylistMusic";

export interface PlaylistMusicRepository {
  getPlaylistMusics(playlistId: string): Promise<PlaylistMusic[]>;
}
