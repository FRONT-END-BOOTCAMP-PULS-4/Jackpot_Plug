"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { SignupRequestDto } from "../../../application/usecases/member/dto/SignupRequestDto";
import { EmailVerificationDto } from "../../../application/usecases/member/dto/EmailVerificationDto";
import { RegisterMemberUseCase } from "../../../application/usecases/member/RegisterMemberUseCase";
import { SendVerificationCodeUseCase } from "../../../application/usecases/member/SendVerificationCodeUseCase";

import EmailInput from "../../components/input/EmailInput";
import PasswordInput from "../../components/input/PasswordInput";
import TextInput from "../../components/input/TextInput";
import Toast from "../../components/toast/Toast";

import { RoundBtn, ProfileImgBtn } from "../../components/button/Buttons";
import { useToast } from "@/hooks/useToast";

export default function JoinForm() {
  const [email, setEmail] = useState(""); // 사용자가 입력한 이메일
  const [checkNum, setCheckNum] = useState(""); // 생성된 인증번호
  const [userCode, setUserCode] = useState(""); // 사용자가 입력한 인증번호
  const [password, setPassword] = useState(""); // 사용자가 입력한 비밀번호
  const [isVerified, setIsVerified] = useState(false); // 인증이 되었는지 유무
  const [passCheck, setPassCheck] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false); // 메인 전송 성공, 실패 여부
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const { showToast } = useToast();

  // 인증번호 메일 전송
  const handleSubmit = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setCheckNum(code);

    const sendVerificationCodeUseCase = new SendVerificationCodeUseCase();
    const verificationDto: EmailVerificationDto = { email, code };

    try {
      const res = await sendVerificationCodeUseCase.execute(verificationDto);
      setIsCodeSent(true);
      showToast(res.message, 2000);
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 2000);
      } else {
        showToast("알 수 없는 에러가 발생했습니다.", 2000);
      }
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) return "";

    const fileExt = profileImage.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `profile/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, profileImage);

    if (uploadError) {
      console.error("이미지 업로드 실패:", uploadError.message);
      return "";
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  // 멤버 테이블에 등록
  const handleRegister = async () => {
    const uploadedUrl = await handleImageUpload();
    const signupRequestDto: SignupRequestDto = {
      email,
      password,
      profileName,
      profilePicUrl: uploadedUrl,
    };

    const registerMemberUseCase = new RegisterMemberUseCase();

    try {
      await registerMemberUseCase.execute(signupRequestDto);
      alert("회원가입이 완료되었습니다!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("회원가입 중 알 수 없는 오류가 발생했습니다");
      }
    }
  };

  return (
    <div>
      <div id="toast-root" />
      <Toast />
      {!showProfileForm ? (
        <>
          <EmailInput
            email={email}
            setEmail={setEmail}
            checkNum={checkNum}
            onClick={handleSubmit}
            setIsVerified={setIsVerified}
          />
          <PasswordInput
            password={password}
            setPassword={setPassword}
            setPassCheck={setPassCheck}
          />
          <RoundBtn
            text="다음"
            size="lg"
            color="accent"
            onClick={
              isVerified && passCheck
                ? () => setShowProfileForm(true)
                : () => showToast("모든 항목을 입력해주세요.", 2000)
            }
          />
        </>
      ) : (
        <>
          <ProfileImgBtn />
          <TextInput
            placeholder="닉네임을 2~10자 이내로 입력해주세요."
            label="닉네임"
          />
          <RoundBtn
            text="시작하기"
            size="lg"
            color="accent"
            onClick={() => setShowProfileForm(true)}
          />
          {/* <label>프로필 사진</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setProfileImage(file);
            }}
          />
          {profileImage && (
            <img src={URL.createObjectURL(profileImage)} alt="preview" />
          )}
          <input
            type="text"
            placeholder="프로필 이름"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
          <button onClick={handleRegister}>회원가입</button> */}
        </>
      )}
    </div>
  );
}
