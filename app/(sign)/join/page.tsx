"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

import EmailInput from "../../components/input/EmailInput";
import PasswordInput from "../../components/input/PasswordInput";
import TextInput from "../../components/input/TextInput";
import Title from "../../components/title/Title";
import { RoundBtn, ProfileImgBtn } from "../../components/button/Buttons";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";

import styles from "../page.module.scss";

export default function JoinForm() {
  const [email, setEmail] = useState("");
  const [checkNum, setCheckNum] = useState("");
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [passCheck, setPassCheck] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated]);

  const handleSubmit = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setCheckNum(code);

    const res = await fetch("http://localhost:3000/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    if (res.ok) {
      showToast(data.message, 2000);
    } else {
      showToast(data.message, 2000);
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

  const handleRegister = async () => {
    const profilePicUrl = await handleImageUpload();

    const res = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, profileName, profilePicUrl }),
    });

    const data = await res.json();
    if (res.ok) {
      showToast(data.message, 2000);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      showToast(data.message, 2000);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleProfileImgBtnClick = () => {
    fileInputRef.current?.click();
  };

  const memoizedProfileImgBtn = useMemo(
    () => (
      <ProfileImgBtn
        image={profileImage ? URL.createObjectURL(profileImage) : undefined}
        onClick={handleProfileImgBtnClick}
      />
    ),
    [profileImage]
  );

  if (isAuthenticated) return null;

  return (
    <section>
      {!showProfileForm ? (
        <div className={styles.div_container}>
          <Title
            isSmall={false}
            titleText="회원가입"
            descriptionText="나만의 리스트를 저장해 보세요."
          />
          <div style={{ height: "50px" }} />
          <EmailInput
            email={email}
            setEmail={setEmail}
            checkNum={checkNum}
            onClick={handleSubmit}
            setIsVerified={setIsVerified}
          />
          <PasswordInput setPass={setPassword} setPassCheck={setPassCheck} />
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
        <div className={styles.div_container}>
          <Title
            isSmall={false}
            titleText="프로필 설정"
            descriptionText="나중에 언제든지 변경할 수 있어요."
          />
          <div style={{ height: "50px" }} />
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
