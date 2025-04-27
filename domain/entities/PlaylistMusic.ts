export class PlaylistMusic {
  constructor(
    public id: string,
    public ISRC: string,
    public videoId: string,
    public videoTitle: string,
    public channelId: string,
    public thumbnail?: string
  ) {}
}
