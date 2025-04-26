import { NextResponse } from "next/server";
import { LoginUseCase } from "@/application/usecases/members/LoginUseCase";
import { LoginRequestDto } from "@/application/usecases/members/dto/LoginRequest.dto";

export async function POST(req: Request) {
  try {
    const body: LoginRequestDto = await req.json();
    const usecase = new LoginUseCase();
    const result = await usecase.execute(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
