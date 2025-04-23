import { supabase } from "../../../lib/supabase";
import { LoginRequestDto } from "./dto/LoginRequest.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // ✅ JWT import

// JWT 시크릿 키 (보통 환경 변수로 관리)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export class LoginUseCase {
  async execute(dto: LoginRequestDto) {
    const { email, password } = dto;

    const { data: member, error } = await supabase
      .from("member")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !member) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const isPasswordMatch = bcrypt.compareSync(password, member.pw);
    if (!isPasswordMatch) {
      throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    // 최근 로그인 시간 갱신
    await supabase
      .from("member")
      .update({ recent_login: new Date().toISOString() })
      .eq("email", email);

    // ✅ JWT 토큰 발급
    const token = jwt.sign(
      {
        id: member.id,
        email: member.email,
        name: member.name,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      message: "로그인 성공",
      member: {
        id: member.id,
        email: member.email,
        profile_pic: member.profile_pic, // 추가
        profile_name: member.profile_name, // 추가
      },
      token,
    };
  }
}
