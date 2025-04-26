import { PlaylistRepository } from "@/domain/repositories/PlaylistRepository";
import { PlaylistDto } from "./dto/PlaylistDto";

export class GetUserPlaylistsUseCase {
  constructor(private playlistRepository: PlaylistRepository) {}

  async execute(userId: string): Promise<PlaylistDto[]> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const playlists = await this.playlistRepository.getUserPlaylists(userId);
    return PlaylistDto.fromDomainArray(playlists);
  }
}
