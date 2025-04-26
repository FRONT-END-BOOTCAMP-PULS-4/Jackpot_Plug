import { PlaylistRepository } from "@/domain/repositories/PlaylistRepository";

export class DeletePlaylistUseCase {
  constructor(private playlistRepository: PlaylistRepository) {}

  async execute(playlistId: string): Promise<void> {
    if (!playlistId) {
      throw new Error("Playlist ID is required");
    }

    await this.playlistRepository.deletePlaylist(playlistId);
  }
}
