import { NextResponse } from "next/server";
import { SendVerificationCodeUseCase } from "@/application/usecase/members/SendVerificationCodeUseCase";
import { EmailVerificationDto } from "@/application/usecase/members/dto/EmailVerification.dto";

export async function POST(req: Request) {
  try {
    const body: EmailVerificationDto = await req.json();
    console.log("Received body:", body); // 여기서 요청 받은 데이터를 확인

    const usecase = new SendVerificationCodeUseCase();
    const result = await usecase.execute(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error processing request:", error); // 에러 로그 확인
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
