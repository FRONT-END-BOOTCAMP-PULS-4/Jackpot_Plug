import { Playlist } from "../entities/Playlist";

export interface PlaylistRepository {
  getUserPlaylists(userId: string): Promise<Playlist[]>;
}
