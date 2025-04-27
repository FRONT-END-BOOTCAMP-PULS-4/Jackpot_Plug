import { PlaylistMusicRepository } from "@/domain/repositories/PlaylistMusicRepository";
import { PlaylistMusic } from "@/domain/entities/PlaylistMusic";
import { supabase } from "@/lib/supabase";

export class SupabasePlaylistMusicRepository
  implements PlaylistMusicRepository
{
  async getPlaylistMusics(playlistId: string): Promise<PlaylistMusic[]> {
    const { data, error } = await supabase
      .from("playlist_videos")
      .select(
        `
        id, 
        ISRC,
        musics!inner(video_id, video_title, channel_id, thumbnail)
      `
      )
      .eq("playlist_id", playlistId);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to fetch playlist musics");
    }

    return (data || []).map(
      (item: any) =>
        new PlaylistMusic(
          item.id,
          item.ISRC,
          item.musics.video_id,
          item.musics.video_title,
          item.musics.channel_id,
          item.musics.thumbnail
        )
    );
  }
}
