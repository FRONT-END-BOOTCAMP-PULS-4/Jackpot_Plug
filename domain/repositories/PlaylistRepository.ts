import { Playlist } from "../entities/Playlist";

export interface PlaylistRepository {
  getUserPlaylists(userId: string): Promise<Playlist[]>;
  deletePlaylist(playlistId: string): Promise<void>;
}
