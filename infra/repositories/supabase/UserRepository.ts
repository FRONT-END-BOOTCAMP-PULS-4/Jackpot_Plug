import { UserRepository } from "@/domain/repositories/UserRepository";
import { User } from "@/domain/entities/Mypage";
import { supabase } from "@/lib/supabase";

export class UserRepositoryImpl implements UserRepository {
  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("member")
      .select("id, email, profile_name, profile_pic")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      profileName: data.profile_name,
      profileImage: data.profile_pic
    };
  }

  async getUserPasswordById(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("member")
      .select("pw")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.pw;
  }

  async uploadProfileImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `profile/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }

  async updateUser(
    userId: string,
    updates: { profileName?: string; profileImage?: string }
  ): Promise<void> {
    const supabaseUpdates: any = {};

    if (updates.profileName) {
      supabaseUpdates.profile_name = updates.profileName;
    }

    if (updates.profileImage) {
      supabaseUpdates.profile_pic = updates.profileImage;
    }

    const { error } = await supabase
      .from("member")
      .update(supabaseUpdates)
      .eq("id", userId);

    if (error) {
      throw new Error("사용자 정보 업데이트에 실패했습니다.");
    }
  }

  async updatePassword(userId: string, newPasswordHash: string): Promise<void> {
    const { error } = await supabase
      .from("member")
      .update({ pw: newPasswordHash })
      .eq("id", userId);

    if (error) {
      throw new Error("비밀번호 변경에 실패했습니다.");
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from("member")
      .delete()
      .eq("id", userId);

    if (error) {
      throw new Error("회원 탈퇴에 실패했습니다.");
    }
  }
}