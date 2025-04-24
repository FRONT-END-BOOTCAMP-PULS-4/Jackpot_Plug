export class YouTubeVideo {
  constructor(
    public id: {
      videoId: string;
    },
    public snippet: {
      title: string;
      description: string;
      channelTitle: string;
      thumbnails: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
      };
      duration: string;
    }
  ) {}
}
