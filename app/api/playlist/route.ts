import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // playlist + 썸네일을 join
    const { data, error } = await supabase
      .from("playlist")
      .select(
        `
        id,
        title,
        playlist_videos (
          index,
          musics (
            thumbnail
          )
        )
      `
      )
      .eq("member_id", userId);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch playlists" },
        { status: 500 }
      );
    }

    // 썸네일 추출: index === 1
    const playlistsWithThumbnail = (data || []).map((playlist: any) => {
      const thumbnailEntry = playlist.playlist_videos?.find(
        (pv: any) => pv.index === 1
      );
      return {
        id: playlist.id,
        title: playlist.title,
        thumbnail: thumbnailEntry?.musics?.thumbnail ?? null,
      };
    });

    return NextResponse.json(playlistsWithThumbnail);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
