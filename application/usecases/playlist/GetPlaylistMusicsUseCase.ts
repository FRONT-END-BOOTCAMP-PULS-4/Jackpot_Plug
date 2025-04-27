import { PlaylistMusicRepository } from "@/domain/repositories/PlaylistMusicRepository";
import { PlaylistMusicDto } from "./dto/PlaylistMusicDto";

export class GetPlaylistMusicsUseCase {
  constructor(private playlistMusicRepository: PlaylistMusicRepository) {}

  async execute(playlistId: string): Promise<PlaylistMusicDto[]> {
    if (!playlistId) {
      throw new Error("Playlist ID is required");
    }

    const playlistMusics = await this.playlistMusicRepository.getPlaylistMusics(
      playlistId
    );
    return PlaylistMusicDto.fromDomainArray(playlistMusics);
  }
}
