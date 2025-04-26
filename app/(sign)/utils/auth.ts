// app\(sign)\utils\auth.ts
import axios from "axios";
import { supabase } from "../../../lib/supabase";

export async function sendVerificationEmail(email: string, code: string) {
  try {
    const res = await axios.post("/api/verify-email", {
      email,
      code,
    });

    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    console.error("이메일 인증 오류:", error);
    return {
      success: false,
      message: error.response?.data?.message || "이메일 인증 과정에서 오류가 발생했습니다.",
    };
  }
}

export async function uploadProfileImage(image: File) {
  try {
    const fileExt = image.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `profile/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, image);

    if (uploadError) {
      console.error("이미지 업로드 실패:", uploadError.message);
      return "";
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    return "";
  }
}

export async function registerUser(
  email: string,
  password: string,
  profileName: string,
  profilePicUrl: string
) {
  try {
    const res = await axios.post("/api/register", {
      email,
      password,
      profileName,
      profilePicUrl,
    });

    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    console.error("회원가입 오류:", error);
    return {
      success: false,
      message: error.response?.data?.message || "회원가입 과정에서 오류가 발생했습니다.",
    };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await axios.post("/api/login", {
      email,
      password,
    });

    return {
      success: true,
      message: res.data.message,
      data: {
        token: res.data.token,
        member: res.data.member,
      },
    };
  } catch (error: any) {
    console.error("로그인 오류:", error);
    return {
      success: false,
      message: error.response?.data?.message || "로그인 과정에서 오류가 발생했습니다.",
      data: null,
    };
  }
}
