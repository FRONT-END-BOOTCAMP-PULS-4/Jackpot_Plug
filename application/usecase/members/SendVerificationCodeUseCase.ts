import { supabase } from "../../../lib/supabase";
import { EmailVerificationDto } from "./dto/EmailVerification.dto";

export class SendVerificationCodeUseCase {
  async execute(dto: EmailVerificationDto) {
    const { email, code } = dto;

    // 이메일 중복 확인
    const { data: existingMember, error } = await supabase
      .from("member")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingMember) {
      throw new Error("이미 가입된 이메일입니다.");
    }

    // 메일 전송 요청
    const res = await fetch("http://localhost:3000/api/mail/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message: code }),
    });

    if (!res.ok) {
      throw new Error("인증번호 전송에 실패했습니다");
    }

    return { message: "해당 이메일로 인증번호를 전송했습니다. 🚀" };
  }
}
