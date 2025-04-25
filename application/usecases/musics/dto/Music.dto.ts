export class MusicDto {
  constructor(
    public videoId: string,
    public title: string,
    public channelTitle: string,
    public thumbnail: string,
    public isrc: string
  ) {}
}
