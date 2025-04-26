import { NextRequest, NextResponse } from "next/server";
import { SupabasePlaylistRepository } from "@/infra/repositories/playlist/SupabasePlaylistRepository";
import { GetUserPlaylistsUseCase } from "@/application/usecases/playlist/GetUserPlaylistsUseCase";

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

    const playlistRepository = new SupabasePlaylistRepository();
    const getUserPlaylistsUseCase = new GetUserPlaylistsUseCase(
      playlistRepository
    );

    const playlists = await getUserPlaylistsUseCase.execute(userId);

    return NextResponse.json(playlists);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      {
        status:
          err instanceof Error && err.message === "User ID is required"
            ? 400
            : 500,
      }
    );
  }
}
