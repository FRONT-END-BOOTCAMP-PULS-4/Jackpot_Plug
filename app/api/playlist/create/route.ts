import { CreatePlaylistUseCase } from "@/application/usecases/playlist/CreatePlaylistUseCase";
import { UpsertMusicsUsecase } from "@/application/usecases/musics/UpsertMusicsUseCase";
import { InsertPlaylistVideosUseCase } from "@/application/usecases/playlist/InsertPlaylistVideoUsecase";

export async function POST(req: Request) {
  const { userId, playlistName, musics, isrcList } = await req.json();

  try {
    const createPlaylistUseCase = new CreatePlaylistUseCase();
    const upsertMusicsUseCase = new UpsertMusicsUsecase();
    const insertPlaylistVideosUseCase = new InsertPlaylistVideosUseCase();

    // 1. 새 플레이리스트 생성
    const playlistId = await createPlaylistUseCase.execute({
      userId,
      playlistName,
    });

    if (!playlistId) {
      throw new Error("플레이리스트 생성 실패");
    }

    // 2. musics 테이블 upsert
    const musicsResult = await upsertMusicsUseCase.execute({ musics });
    if (!musicsResult) {
      throw new Error("음악 데이터 저장 실패");
    }

    // 3. playlist_videos 테이블에 연결
    const videosResult = await insertPlaylistVideosUseCase.execute({
      playlistId,
      isrcList,
    });
    if (!videosResult) {
      throw new Error("플레이리스트 트랙 등록 실패");
    }

    return Response.json({ message: "success", playlistId: playlistId });
  } catch (error: any) {
    console.error("[새 플레이리스트 생성 실패]", error);
    return Response.json(
      { message: "fail", error: error.message },
      { status: 500 }
    );
  }
}
