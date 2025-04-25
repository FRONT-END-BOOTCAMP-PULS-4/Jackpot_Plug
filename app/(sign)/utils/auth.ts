import { supabase } from "../../../lib/supabase";

export async function sendVerificationEmail(email: string, code: string) {
  try {
    const res = await fetch("http://localhost:3000/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    return { 
      success: res.ok, 
      message: data.message 
    };
  } catch (error) {
    console.error("이메일 인증 오류:", error);
    return { 
      success: false, 
      message: "이메일 인증 과정에서 오류가 발생했습니다." 
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
    const res = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, profileName, profilePicUrl }),
    });

    const data = await res.json();
    return { 
      success: res.ok, 
      message: data.message 
    };
  } catch (error) {
    console.error("회원가입 오류:", error);
    return { 
      success: false, 
      message: "회원가입 과정에서 오류가 발생했습니다." 
    };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    return { 
      success: res.ok, 
      message: data.message,
      data: res.ok ? { token: data.token, member: data.member } : null
    };
  } catch (error) {
    console.error("로그인 오류:", error);
    return { 
      success: false, 
      message: "로그인 과정에서 오류가 발생했습니다.",
      data: null
    };
  }
}