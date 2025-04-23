"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { SignUpRequestDto } from "../../../application/usecases/member/dto/SignUpRequestDto";
import { EmailVerificationDto } from "../../../application/usecases/member/dto/EmailVerificationDto";
import { RegisterMemberUseCase } from "../../../application/usecases/member/RegisterMemberUseCase";
import { SendVerificationCodeUseCase } from "../../../application/usecases/member/SendVerificationCodeUseCase";

import EmailInput from "../../components/input/EmailInput";
import PasswordInput from "../../components/input/PasswordInput";
import TextInput from "../../components/input/TextInput";
import Title from "../../components/title/Title";

import { RoundBtn, ProfileImgBtn } from "../../components/button/Buttons";
import { useToast } from "@/hooks/useToast";

export default function JoinForm() {
  const [email, setEmail] = useState(""); // 사용자가 입력한 이메일
  const [checkNum, setCheckNum] = useState(""); // 생성된 인증번호
  const [password, setPassword] = useState(""); // 사용자가 입력한 비밀번호
  const [isVerified, setIsVerified] = useState(false); // 인증이 되었는지 유무
  const [passCheck, setPassCheck] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const router = useRouter();

  const { showToast } = useToast();

  // 인증번호 메일 전송
  const handleSubmit = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setCheckNum(code);

    const sendVerificationCodeUseCase = new SendVerificationCodeUseCase();
    const verificationDto: EmailVerificationDto = { email, code };

    try {
      const res = await sendVerificationCodeUseCase.execute(verificationDto);
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
    const signupRequestDto: SignUpRequestDto = {
      email,
      password,
      profileName,
      profilePicUrl: uploadedUrl,
    };

    const registerMemberUseCase = new RegisterMemberUseCase();

    try {
      await registerMemberUseCase.execute(signupRequestDto);
      showToast("회원가입이 완료되었습니다!", 2000);
      setTimeout(() => {
        router.push("/login");
      }, 2000); // 2초 후 이동 (토스트 메시지 보여준 후)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        showToast("회원가입 중 알 수 없는 오류가 발생했습니다", 2000);
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 이미지 선택 시 호출
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  // 버튼 클릭 시 숨겨진 input 열기
  const handleProfileImgBtnClick = () => {
    fileInputRef.current?.click();
  };

  // ProfileImgBtn 최적화 - 렌더링 불필요한 경우 렌더링 방지
  const memoizedProfileImgBtn = useMemo(() => {
    return (
      <ProfileImgBtn
        image={profileImage ? URL.createObjectURL(profileImage) : undefined}
        onClick={handleProfileImgBtnClick}
      />
    );
  }, [profileImage]); // profileImage만 변경될 때에만 업데이트

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", // 화면 세로 중앙 정렬용
      }}
    >
      {!showProfileForm ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Title
            isSmall={false}
            titleText="회원가입"
            descriptionText="나만의 리스트를 저장해 보세요."
          />
          <EmailInput
            email={email}
            setEmail={setEmail}
            checkNum={checkNum}
            onClick={handleSubmit}
            setIsVerified={setIsVerified}
          />
          <PasswordInput
            password={password}
            setPass={setPassword}
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
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Title
            isSmall={false}
            titleText="프로필 설정"
            descriptionText="나중에 언제든지 변경할 수 있어요."
          />
          {memoizedProfileImgBtn}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageSelect}
          />
          <TextInput
            placeholder="닉네임을 2~10자 이내로 입력해주세요."
            label="닉네임"
            setProfileName={setProfileName}
          />
          <RoundBtn
            text="시작하기"
            size="lg"
            color="accent"
            onClick={handleRegister}
          />
        </div>
      )}
    </section>
  );
}
