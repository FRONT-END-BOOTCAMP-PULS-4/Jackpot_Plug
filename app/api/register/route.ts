import { NextResponse } from "next/server";
import { RegisterMemberUseCase } from "@/application/usecases/members/RegisterMemberUseCase";
import { SignUpRequestDto } from "@/application/usecases/members/dto/SignUpRequest.dto";

export async function POST(req: Request) {
  try {
    const body: SignUpRequestDto = await req.json();
    const usecase = new RegisterMemberUseCase();
    await usecase.execute(body);
    return NextResponse.json({ message: "회원가입이 완료되었습니다!" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
