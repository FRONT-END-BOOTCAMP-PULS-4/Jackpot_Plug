import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "../../../utils/spotify";
import { formatDuration } from "@/utils/formatDuration";

export interface ISpotifyRecoData {
  name?: string;
  artist?: string;
  albumImage: string | null;
  previewUrl: string | null;
  duration?: string;
}

export async function GET() {
  try {
    const token = await getSpotifyAccessToken();
    const spotifyBaseurl = process.env.NEXT_PUBLIC_SPOTIFY_API_BASEURL;
    const response = await fetch(
      `${spotifyBaseurl}/search?q=K-Pop&type=playlist&limit=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Cannot get recommended tracks",
        },
        { status: 400 }
      );
    }

    const playlistData = await response.json();
    const playlistId = playlistData?.playlists?.items[0]?.id;

    const trackRes = await fetch(
      `${spotifyBaseurl}/playlists/${playlistId}/tracks?limit=4`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const trackData = await trackRes.json();
    console.log(trackData.items);

    const tracks = trackData?.items?.map((item: any) => ({
      name: item.track.name,
      artist: item.track.artists.map((a: any) => a.name).join(", "),
      albumImage: item.track.album.images?.[0]?.url,
      previewUrl: item.track.preview_url,
      duration: formatDuration(item.track.duration_ms),
    }));

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("cant find recommended tracks", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
