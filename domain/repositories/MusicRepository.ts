import { Music } from "../entities/Music";

export interface MusicRepository {
  upsertMusics(music: Music[]): Promise<boolean>;
}
