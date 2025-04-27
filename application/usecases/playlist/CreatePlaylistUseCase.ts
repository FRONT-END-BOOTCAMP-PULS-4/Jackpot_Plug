import { SupabasePlaylistRepository } from "@/infra/repositories/supabase/SupabasePlaylistRepository";
import { CreatePlaylistInput } from "./dto/CreatePlaylist.dto";

export class CreatePlaylistUseCase {
  private repository: SupabasePlaylistRepository;

  constructor() {
    this.repository = new SupabasePlaylistRepository();
  }

  async execute({
    userId,
    playlistName,
  }: CreatePlaylistInput): Promise<string | null> {
    const playlistId = await this.repository.createPlaylist(
      userId,
      playlistName
    );
    return playlistId;
  }
}
