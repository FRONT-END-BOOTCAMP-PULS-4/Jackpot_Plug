import { PlaylistRepository } from "@/domain/repositories/PlaylistRepository";
import { Playlist } from "@/domain/entities/Playlist";
import { supabase } from "@/lib/supabase";

export class SupabasePlaylistRepository implements PlaylistRepository {
  async createPlaylist(
    userId: string,
    playlistName: string
  ): Promise<string | null> {
    const { data, error } = await supabase
      .from("playlist")
      .insert({ member_id: userId, title: playlistName })
      .select()
      .single();

    if (error || !data) {
      console.error("Create playlist error:", error);
      return null;
    }

    return data.id;
  }

  async insertPlaylistVideos(
    playlistId: string,
    isrcList: string[]
  ): Promise<boolean> {
    const playlistVideos = isrcList.map((isrc, index) => ({
      playlist_id: playlistId,
      ISRC: isrc,
      index: index + 1,
    }));

    const { error } = await supabase
      .from("playlist_videos")
      .insert(playlistVideos);

    if (error) {
      console.error("Insert playlist_videos error:", error);
      return false;
    }
    return true;
  }

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

  async deletePlaylist(playlistId: string): Promise<void> {
    try {
      // playlist_videos 테이블에서 해당 플레이리스트의 모든 비디오 삭제
      const { error: videosError } = await supabase
        .from("playlist_videos")
        .delete()
        .eq("playlist_id", playlistId);

      if (videosError) {
        console.error("Error deleting playlist videos:", videosError);
        throw new Error("Failed to delete playlist videos");
      }

      // 그 다음 playlist 테이블에서 플레이리스트 삭제
      const { error: playlistError } = await supabase
        .from("playlist")
        .delete()
        .eq("id", playlistId);

      if (playlistError) {
        console.error("Error deleting playlist:", playlistError);
        throw new Error("Failed to delete playlist");
      }
    } catch (error) {
      console.error("Error in deletePlaylist:", error);
      throw error;
    }
  }
}
