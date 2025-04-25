import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get("playlistId");

    if (!playlistId) {
      return NextResponse.json(
        { error: "플레이리스트 ID가 필요합니다" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("playlist_videos")
      .select(
        `
        id, 
        ISRC,
        musics!inner(video_title, channel_id)
      `
      )
      .eq("playlist_id", playlistId);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "플레이리스트 비디오 조회 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  }
}
