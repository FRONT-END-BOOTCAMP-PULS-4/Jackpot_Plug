"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Title from "../../../components/title/Title";
import { RoundBtn, ProfileImgBtn } from "../../../components/button/Buttons";
import TextInput from "../../../components/input/TextInput";
import { useToast } from "@/hooks/useToast";
import { uploadProfileImage, registerUser } from "../../utils/auth";
import styles from "../../page.module.scss";

interface ProfileFormProps {
  email: string;
  password: string;
}

export default function ProfileForm({ email, password }: ProfileFormProps) {
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleProfileImgBtnClick = () => {
    fileInputRef.current?.click();
  };

  const handleRegister = async () => {
    if (
      !profileName ||
      profileName.length < 2 ||
      profileName.length > 10 ||
      !profileImage
    ) {
      showToast("모든 항목을 입력해주세요.", 2000);
      return;
    }

    const profilePicUrl = await uploadProfileImage(profileImage);
    if (!profilePicUrl) {
      showToast("이미지 업로드에 실패했습니다.", 2000);
      return;
    }

    const { success, message } = await registerUser(
      email,
      password,
      profileName,
      profilePicUrl
    );
    showToast(message, 2000);

    if (success) {
      setTimeout(() => router.push("/login"), 2000);
    }
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

  return (
    <div className={styles.div_container}>
      <Title
        isSmall={false}
        titleText="프로필 설정"
        descriptionText="나중에 언제든지 변경할 수 있어요."
      />
      <div className={styles.div_gap_60} />
      {memoizedProfileImgBtn}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageSelect}
      />
      <div className={styles.div_gap_46} />
      <TextInput
        placeholder="닉네임을 2~10자 이내로 입력해주세요."
        label="닉네임"
        setChangeText={setProfileName}
      />
      <div className={styles.div_gap_25} />
      <RoundBtn
        text="시작하기"
        size="lg"
        color="accent"
        onClick={handleRegister}
      />
    </div>
  );
}
