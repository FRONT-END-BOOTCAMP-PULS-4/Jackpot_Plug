import { NextResponse } from "next/server";
import { SearchMusicListUseCase } from "@/application/usecases/musics/SearchMusicListUseCase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lists = searchParams.get("lists")?.split(",") || [];

    const searchMusicListUseCase = new SearchMusicListUseCase();

    const result = await searchMusicListUseCase.execute(lists || "");

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "NoSpotifyTracks" || error.message === "NoISRC") {
      return NextResponse.json(
        {
          error: `맞는 음악 찾기에 실패했어요.😢
            직접 검색을 통해 원하는 노래를 찾아보세요.`,
        },
        { status: 200 }
      );
    }

    console.error("Error in route handler:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
