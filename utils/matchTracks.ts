export interface YoutubeItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

export interface SpotifyTrack {
  name: string;
  artist: string;
  isrc: string;
}

export interface MatchedYoutubeItem extends YoutubeItem {
  matchedTrack: SpotifyTrack;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .trim();
}

export function matchTracks(
  youtubeItems: YoutubeItem[],
  spotifyTracks: SpotifyTrack[]
): MatchedYoutubeItem[] {
  // YouTube 항목 정규화
  const normalizedYoutubeItems = youtubeItems.map((item) => ({
    ...item,
    normalizedTitle: normalize(item.snippet.title),
    normalizedDescription: normalize(item.snippet.description),
    normalizedChannelTitle: normalize(item.snippet.channelTitle || ""),
  }));

  // 각 Spotify 트랙에 대해 매칭되는 YouTube 항목 찾기
  return spotifyTracks
    .map((track) => {
      const trackTitle = normalize(track.name);
      const artistName = normalize(track.artist);

      // YouTube 아이템 중에서 곡명 또는 아티스트명이 포함된 가장 적절한 것을 찾기
      const matched = normalizedYoutubeItems.find((item) => {
        return (
          item.normalizedTitle.includes(trackTitle) &&
          (item.normalizedChannelTitle.includes(artistName) ||
            item.normalizedDescription.includes(artistName))
        );
      });

      return matched
        ? { ...matched, matchedTrack: track }
        : { errorMassage: "매칭되는 노래가 없어요", matchedTrack: track };
    })
    .filter(Boolean) as MatchedYoutubeItem[]; // null 제거
}
