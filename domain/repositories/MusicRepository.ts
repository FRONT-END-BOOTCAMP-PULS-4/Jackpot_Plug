export interface MusicRepository {
  fetchDescription(videoId: string): Promise<string>;
}
