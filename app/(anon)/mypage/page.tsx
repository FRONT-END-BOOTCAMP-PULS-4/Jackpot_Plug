"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { AnimatePresence } from "motion/react";

import InputField from "../../components/input/InputField";
import {
  IconBtn,
  RoundBtn,
  ProfileImgBtn,
} from "../../components/button/Buttons";
import PasswordInput from "../../components/input/PasswordInput";
import Modal from "../../components/modal/Modal";
import styles from "./page.module.scss";

import useModal from "@/hooks/useModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { supabase } from "../../../lib/supabase";
import { useAuthStore } from "@/store/authStore";

import { useRouter } from "next/navigation";

import bcrypt from "bcryptjs";

export default function Page() {
  const [userData, setUserData] = useState<{
    id: string;
    email: string;
    profileName: string;
    profileImage: string | File | null;
  }>({
    id: "",
    email: "",
    profileName: "",
    profileImage: null,
  });

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passCheck, setPassCheck] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();
  const { logout } = useAuth();

  const TitleModal = Modal;
  const titleModal = useModal();

  const InfoModal = Modal;
  const infoModal = useModal();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated]);

  const parseJwt = (token: string) => {
    try {
      if (!token || typeof token !== "string" || !token.includes(".")) {
        throw new Error("유효하지 않은 토큰 형식");
      }
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (e) {
      console.error("토큰 파싱 오류:", e);
      return null;
    }
  };

  useEffect(() => {
    const getInitialAuthState = () => {
      const tokenString = localStorage.getItem("auth-storage");
      if (!tokenString)
        return { id: "", email: "", profileName: "", profileImage: null };

      try {
        const parsed = JSON.parse(tokenString);
        const jwt = parsed?.state?.token;
        const user = parsed?.state?.user;
        const payload = jwt && jwt.includes(".") ? parseJwt(jwt) : null;

        return {
          id: user?.id ?? payload?.id ?? "",
          email: user?.email ?? payload?.email ?? "",
          profileName: user?.profile_name ?? "",
          profileImage: user?.profile_pic ?? null,
        };
      } catch (e) {
        console.error("auth-storage 파싱 실패", e);
        return { id: "", email: "", profileName: "", profileImage: null };
      }
    };

    const initialState = getInitialAuthState();
    setUserData(initialState);
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserData((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const handleProfileImgBtnClick = () => {
    fileInputRef.current?.click();
  };

  const memoizedProfileImgBtn = useMemo(
    () => (
      <ProfileImgBtn
        image={
          typeof userData.profileImage === "string"
            ? userData.profileImage
            : userData.profileImage
            ? URL.createObjectURL(userData.profileImage)
            : undefined
        }
        onClick={handleProfileImgBtnClick}
      />
    ),
    [userData.profileImage]
  );

  const handleUpdateProfile = async () => {
    const tokenString = localStorage.getItem("auth-storage");
    if (!tokenString) {
      showToast("로그인 정보가 없습니다.");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(tokenString);
    } catch (e) {
      console.error("로컬스토리지 파싱 실패", e);
      showToast("사용자 정보를 불러올 수 없습니다.");
      return;
    }

    const originalName = parsed.state.user.profile_name;

    const newName = userData.profileName?.trim();
    const newImage = userData.profileImage;

    if (newName && (newName.length < 2 || newName.length > 10)) {
      showToast("닉네임은 2자 이상 10자 이하로 입력해주세요.");
      return;
    }

    const isNameChanged = newName && newName !== originalName;
    const isImageChanged = newImage instanceof File;

    if (!isNameChanged && !isImageChanged) {
      showToast("수정할 항목이 없습니다.");
      return;
    }

    const updates: any = {};

    if (isNameChanged) updates.profile_name = newName;

    if (isImageChanged) {
      const fileExt = newImage.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `profile/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, newImage);

      if (uploadError) {
        console.error("이미지 업로드 실패:", uploadError.message);
        showToast("이미지 업로드에 실패했습니다.");
        return;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      updates.profile_pic = urlData.publicUrl;
    }

    const { error } = await supabase
      .from("member")
      .update(updates)
      .eq("id", userData.id);

    if (error) {
      console.error("업데이트 실패:", error.message);
      showToast("프로필 수정에 실패했습니다.");
      return;
    }

    setUserData((prev) => ({
      ...prev,
      profileName: updates.profile_name ?? prev.profileName,
      profileImage: updates.profile_pic ?? prev.profileImage,
    }));

    // 👇 구조적으로 간결하게 업데이트
    Object.assign(parsed.state.user, {
      ...(updates.profile_name && { profile_name: updates.profile_name }),
      ...(updates.profile_pic && { profile_pic: updates.profile_pic }),
    });

    try {
      localStorage.setItem("auth-storage", JSON.stringify(parsed));
    } catch (e) {
      console.error("로컬스토리지 갱신 실패", e);
    }

    showToast("프로필이 성공적으로 수정되었습니다!");
  };

  const handlePasswordChange = async () => {
    if (!password || !newPassword || !passCheck) {
      alert("모든 비밀번호 항목을 입력해주세요.");
      return;
    }

    if (newPassword !== passCheck) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const { data: user, error } = await supabase
      .from("member")
      .select("pw")
      .eq("id", userData.id)
      .single();

    if (error || !user) {
      alert("사용자 정보를 불러오지 못했습니다.");
      return;
    }

    const isMatch = await bcrypt.compare(password, user.pw);
    if (!isMatch) {
      alert("현재 비밀번호가 일치하지 않습니다.");
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from("member")
      .update({ pw: hashedNewPassword })
      .eq("id", userData.id);

    if (updateError) {
      alert("비밀번호 변경에 실패했습니다.");
      return;
    }

    setPassword("");
    setNewPassword("");
    setPassCheck("");
    titleModal.close();
    showToast("비밀번호가 성공적으로 변경되었습니다.");
  };

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    const { error } = await supabase
      .from("member")
      .delete()
      .eq("id", userData.id);

    if (error) {
      alert("회원 탈퇴에 실패했습니다.");
      console.error("회원 탈퇴 실패:", error.message);
      return;
    }

    // 탈퇴 후 로그아웃 및 페이지 리다이렉트
    infoModal.close();
    logout();
    window.location.reload();
  };

  if (!isAuthenticated) return null;

  return (
    <div className={styles.div_container}>
      {memoizedProfileImgBtn}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageSelect}
      />
      <InputField
        name="email"
        type="email"
        value={userData.email}
        onChangeAction={() => {}}
      />
      <InputField
        name="password"
        type="password"
        value={"************"}
        onChangeAction={() => {}}
        onClick={titleModal.open}
        showButton={true}
        buttonContent={
          <IconBtn icon="edit" size="xs" customClassName="verify" />
        }
      />
      <InputField
        name="profile_name"
        type="text"
        value={userData.profileName}
        onChangeAction={(e) =>
          setUserData((prev) => ({ ...prev, profileName: e.target.value }))
        }
        showButton={true}
        placeholder="닉네임을 2~10자 이내로 입력해주세요."
        label="닉네임"
        buttonContent={
          <IconBtn icon="edit" size="xs" customClassName="verify" />
        }
      />
      <RoundBtn
        text="변경하기"
        size="lg"
        color="accent"
        onClick={handleUpdateProfile}
      />
      <RoundBtn
        text="로그아웃"
        size="lg"
        color="accent"
        onClick={() => {
          logout();
          window.location.reload();
        }}
      />
      <button onClick={infoModal.open}>내 계정 삭제</button>
      <AnimatePresence mode="wait">
        {titleModal.isOpen && (
          <TitleModal
            isOpen={titleModal.isOpen}
            onClose={titleModal.close}
            buttonTitle="비밀번호 변경하기"
            onAction={handlePasswordChange}
            size="lg"
            title="비밀번호 변경"
          >
            <p>현재 비밀번호</p>
            <div className={styles.div_container}>
              <PasswordInput setPass={setPassword} />
            </div>
            <p>새 비밀번호</p>
            <div className={styles.div_container}>
              <PasswordInput setPass={setNewPassword} />
            </div>
            <p>새 비밀번호 확인</p>
            <div className={styles.div_container}>
              <PasswordInput setPass={setPassCheck} />
            </div>
          </TitleModal>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {infoModal.isOpen && (
          <InfoModal
            isOpen={infoModal.isOpen}
            onClose={infoModal.close}
            buttonTitle="네, 탈퇴할게요."
            onAction={handleDeleteAccount}
            size="sm"
          >
            <p>정말로 탈퇴하시겠습니까?😢</p>
          </InfoModal>
        )}
      </AnimatePresence>
    </div>
  );
}
