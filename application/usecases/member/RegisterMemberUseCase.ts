import { supabase } from "../../../app/lib/supabase";
import { SignupRequestDto } from "./dto/SignupRequestDto";

export class RegisterMemberUseCase {
  async execute(dto: SignupRequestDto) {
    const { email, password, profileName, profilePicUrl } = dto;

    // 회원가입 처리
    const { data, error } = await supabase.from("member").insert([
      {
        email: email,
        pw: password,
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
