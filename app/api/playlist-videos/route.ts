import { NextRequest, NextResponse } from "next/server";
import { GetPlaylistMusicsUseCase } from "@/application/usecases/playlist/GetPlaylistMusicsUseCase";
import { SupabasePlaylistMusicRepository } from "@/infra/repositories/supabase/SupabasePlaylistMusicRepository";

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

    const playlistMusicRepository = new SupabasePlaylistMusicRepository();
    const getPlaylistMusicsUseCase = new GetPlaylistMusicsUseCase(
      playlistMusicRepository
    );

    const playlistMusics = await getPlaylistMusicsUseCase.execute(playlistId);

    return NextResponse.json(playlistMusics);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "서버 내부 오류" },
      {
        status:
          err instanceof Error && err.message === "Playlist ID is required"
            ? 400
            : 500,
      }
    );
  }
}
