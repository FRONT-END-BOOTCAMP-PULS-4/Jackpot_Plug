import { SupabasePlaylistRepository } from "@/infra/repositories/playlist/SupabasePlaylistRepository";
import { InsertPlaylistVideos } from "./dto/InsertPlaylistVideo.dto";

export class InsertPlaylistVideosUseCase {
  private repository: SupabasePlaylistRepository;

  constructor() {
    this.repository = new SupabasePlaylistRepository();
  }

  async execute({
    playlistId,
    isrcList,
  }: InsertPlaylistVideos): Promise<boolean> {
    return await this.repository.insertPlaylistVideos(playlistId, isrcList);
  }
}
