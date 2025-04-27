// app/api/playlist/[playlistId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SupabasePlaylistRepository } from "@/infra/repositories/supabase/SupabasePlaylistRepository";
import { DeletePlaylistUseCase } from "@/application/usecases/playlist/DeletePlaylistUseCase";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  try {
    const { playlistId } = await params;

    if (!playlistId) {
      return NextResponse.json(
        { error: "Playlist ID is required" },
        { status: 400 }
      );
    }

    const playlistRepository = new SupabasePlaylistRepository();
    const deletePlaylistUseCase = new DeletePlaylistUseCase(playlistRepository);

    await deletePlaylistUseCase.execute(playlistId);

    return NextResponse.json({ message: "Playlist deleted successfully" });
  } catch (err) {
    console.error("Error deleting playlist:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
