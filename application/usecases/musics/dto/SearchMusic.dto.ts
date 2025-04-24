export class SearchMusicDto {
  constructor(
    public videoId: string,
    public title: string,
    public channelTitle: string,
    public thumbnail: string,
    public duration: string,
    public isrc?: string
  ) {}
}
