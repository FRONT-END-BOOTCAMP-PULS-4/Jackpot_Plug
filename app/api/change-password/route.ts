import { NextRequest, NextResponse } from "next/server";
import { ChangePasswordDto } from "@/application/usecases/mypages/dto/ChangePassword.dto";
import { ChangePasswordUsecase } from "@/application/usecases/mypages/ChangePasswordUsecase";
import { UserRepositoryImpl } from "@/infra/repositories/supabase/UserRepository";

export async function POST(request: NextRequest) {
  try {
    const { userId, currentPassword, newPassword } = await request.json();

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "모든 필드가 필요합니다." },
        { status: 400 }
      );
    }

    const dto = new ChangePasswordDto(userId, currentPassword, newPassword);
    const userRepository = new UserRepositoryImpl();
    const changePasswordUsecase = new ChangePasswordUsecase(userRepository);

    await changePasswordUsecase.execute(dto);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("비밀번호 변경 API 오류:", error);
    return NextResponse.json(
      { message: error.message || "비밀번호 변경 실패" },
      { status: 500 }
    );
  }
}