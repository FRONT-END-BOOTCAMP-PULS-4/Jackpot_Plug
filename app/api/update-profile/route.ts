import { NextRequest, NextResponse } from "next/server";
import { UpdateProfileDto } from "@/application/usecases/mypages/dto/UpdateProfile.dto";
import { UpdateProfileUsecase } from "@/application/usecases/mypages/UpdateProfileUsecase";
import { UserRepositoryImpl } from "@/infra/repositories/supabase/UserRepository";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId") as string;
    const profileName = formData.get("profileName") as string;
    const profileImage = formData.get("profileImage") as File | null;

    if (!userId) {
      return NextResponse.json(
        { message: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const dto = new UpdateProfileDto(userId, profileName, profileImage);
    const userRepository = new UserRepositoryImpl();
    const updateProfileUsecase = new UpdateProfileUsecase(userRepository);

    const result = await updateProfileUsecase.execute(dto);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("프로필 업데이트 API 오류:", error);
    return NextResponse.json(
      { message: error.message || "프로필 업데이트 실패" },
      { status: 500 }
    );
  }
}