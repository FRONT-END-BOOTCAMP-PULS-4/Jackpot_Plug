import { supabase } from "../../../lib/supabase";
import { MusicRepository } from "@/domain/repositories/MusicRepository";
import { Music } from "@/domain/entities/Music";

export class SupabaseMusicRepository implements MusicRepository {
  async upsertMusics(musics: Music[]): Promise<boolean> {
    for (const music of musics) {
      const { error } = await supabase.from("musics").upsert({
        ISRC: music.isrc,
        video_id: music.videoId,
        video_title: music.title,
        channel_id: music.channelTitle,
        thumbnail: music.thumbnail,
      });

      if (error) {
        console.error("Insert music error:", error);
        return false;
      }
    }
    return true;
  }
}
