import { Playlist } from "../entities/Playlist";

export interface PlaylistRepository {
  createPlaylist(userId: string, playlistName: string): Promise<string | null>;
  insertPlaylistVideos(
    playlistId: string,
    isrcList: string[]
  ): Promise<boolean>;
  getUserPlaylists(userId: string): Promise<Playlist[]>;
  deletePlaylist(playlistId: string): Promise<void>;
}
