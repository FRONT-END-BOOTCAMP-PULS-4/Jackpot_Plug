import { getVideoInfoUseCase } from "@/application/usecase/musics/useGetVideoContents";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("id");

  if (!videoId)
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 }
    );

  try {
    const result = await getVideoInfoUseCase(videoId);
    return Response.json(result);
  } catch (error: any) {
    if (error.message === "NoDescription" || error.message === "NoMusicItem") {
      return Response.json(
        {
          error: `음악 리스트를 추출할 수 없어요. 😢
            직접 검색을 통해 원하는 노래를 찾아보세요.`,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
