import { supabase } from "../../../app/lib/supabase";
import { LoginRequestDto } from "./dto/LoginRequestDto";
import bcrypt from "bcryptjs"; // bcryptjs import

export class LoginUseCase {
  async execute(dto: LoginRequestDto) {
    const { email, password } = dto;

    // 🔍 이메일로 유저 조회
    const { data: member, error } = await supabase
      .from("member")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !member) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    // 🔐 비밀번호 해시 비교
    const isPasswordMatch = bcrypt.compareSync(password, member.pw);

    if (!isPasswordMatch) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    // ✅ 로그인 성공 → 최근 로그인 시간 갱신
    await supabase
      .from("member")
      .update({ recent_login: new Date().toISOString() })
      .eq("email", email);

    return {
      message: "로그인 성공",
      member,
    };
  }
}
