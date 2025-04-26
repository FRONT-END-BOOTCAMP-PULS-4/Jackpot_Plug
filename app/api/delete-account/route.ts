import { NextRequest, NextResponse } from "next/server";
import { DeleteAccountUsecase } from "@/application/usecases/mypages/DeleteAccountUsecase";
import { UserRepositoryImpl } from "@/infra/repositories/supabase/UserRepository";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const userRepository = new UserRepositoryImpl();
    const deleteAccountUsecase = new DeleteAccountUsecase(userRepository);

    await deleteAccountUsecase.execute(userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("계정 삭제 API 오류:", error);
    return NextResponse.json(
      { message: error.message || "계정 삭제 실패" },
      { status: 500 }
    );
  }
}
