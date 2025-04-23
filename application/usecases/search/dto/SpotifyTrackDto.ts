export class SpotifyTrackDto {
  constructor(
    public id: string,
    public name: string,
    public artist: string,
    public album: string,
    public isrc?: string,
    public image?: string
  ) {}
}
