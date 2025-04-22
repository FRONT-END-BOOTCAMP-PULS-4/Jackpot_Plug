import { supabase } from "../../../lib/supabase";
import { IMemberRepository } from "../../../domain/repositories/IMemberRepository";
import { Member } from "../../../domain/entities/Member";

export class SupabaseMemberRepository implements IMemberRepository {
  async createMember(member: Member): Promise<void> {
    const { error } = await supabase.from("member").insert([
      {
        email: member.email,
        pw: member.password,
        profile_name: member.profileName,
        profile_pic: member.profilePicUrl,
        recent_login: member.recentLogin,
      },
    ]);
    if (error) {
      throw new Error(`회원 가입 실패: ${error.message}`);
    }
  }

  async getMemberByEmail(email: string): Promise<Member | null> {
    const { data, error } = await supabase
      .from("member")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return null;
    }

    return new Member(
      data.email,
      data.pw,
      data.profile_name,
      data.profile_pic,
      new Date(data.recent_login)
    );
  }
}
