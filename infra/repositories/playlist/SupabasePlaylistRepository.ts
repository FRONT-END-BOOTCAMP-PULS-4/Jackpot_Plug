import { PlaylistRepository } from "@/domain/repositories/PlaylistRepository";
import { Playlist } from "@/domain/entities/Playlist";
import { supabase } from "@/lib/supabase";

export class SupabasePlaylistRepository implements PlaylistRepository {
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    const { data, error } = await supabase
      .from("playlist")
      .select(
        `
        id,
        title,
        playlist_videos (
          index,
          musics (
            thumbnail
          )
        )
      `
      )
      .eq("member_id", userId);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to fetch playlists");
    }

    const playlists = (data || []).map((playlist: any) => {
      const thumbnailEntry = playlist.playlist_videos?.find(
        (pv: any) => pv.index === 1
      );
      return {
        id: playlist.id,
        title: playlist.title,
        thumbnail: thumbnailEntry?.musics?.thumbnail ?? null,
      };
    });

    return playlists;
  }
}
