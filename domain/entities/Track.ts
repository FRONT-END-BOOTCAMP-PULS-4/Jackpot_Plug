export class Track {
  constructor(
    public id: string,
    public name: string,
    public artist: string,
    public isrc: string,
    public album?: string,
    public imageUrl?: string
  ) {}
}
