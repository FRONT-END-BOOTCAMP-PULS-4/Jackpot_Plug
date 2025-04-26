import { supabase } from "../../../lib/supabase";
import { SignUpRequestDto } from "./dto/SignUpRequest.dto";
import bcrypt from "bcryptjs"; // 🔑 bcryptjs import

export class RegisterMemberUseCase {
  async execute(dto: SignUpRequestDto) {
    const { email, password, profileName, profilePicUrl } = dto;

    // 🔐 비밀번호 해시 처리
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 회원가입 처리
    const { data, error } = await supabase.from("member").insert([
      {
        email: email,
        pw: hashedPassword, // 👉 해싱된 비밀번호 저장
        is_verified: true,
        recent_login: new Date().toISOString(),
        profile_name: profileName,
        profile_pic: profilePicUrl,
      },
    ]);

    if (error) {
      throw new Error(`회원가입 실패: ${error.message}`);
    }

    return data;
  }
}
