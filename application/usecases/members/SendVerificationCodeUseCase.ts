// application\usecases\members\SendVerificationCodeUseCase.ts
import { supabase } from "../../../lib/supabase";
import { EmailVerificationDto } from "./dto/EmailVerification.dto";
import axios from "axios";

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
    try {
      await axios.post("http://localhost:3000/api/mail/", {
        email,
        message: code,
      });
    } catch (error) {
      console.error("메일 전송 실패:", error);
      throw new Error("인증번호 전송에 실패했습니다");
    }

    return { message: "해당 이메일로 인증번호를 전송했습니다. 🚀" };
  }
}
