import { NextResponse } from "next/server";
import { SearchMusicUseCase } from "@/application/usecases/search/SearchMusicUseCase";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    const searchMusicUseCase = new SearchMusicUseCase();
    return await searchMusicUseCase.execute(query || "");
  } catch (error) {
    console.error("Error in route handler:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
