import { supabase } from "../../../app/lib/supabase";
import { LoginRequestDto } from "./dto/LoginRequestDto";

export class LoginUseCase {
  async execute(dto: LoginRequestDto) {
    const { email, password } = dto;

    const { data: member, error } = await supabase
      .from("member")
      .select("*")
      .eq("email", email)
      .eq("pw", password) // 실제로는 비밀번호 암호화 후 비교하는 게 안전해요
      .single();

    if (error || !member) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    // 로그인 성공 → 로그인 기록 업데이트 (optional)
    await supabase
      .from("member")
      .update({ recent_login: new Date().toISOString() })
      .eq("email", email);

    return {
      message: "로그인 성공",
      member, // 로그인된 사용자 정보 반환
    };
  }
}
