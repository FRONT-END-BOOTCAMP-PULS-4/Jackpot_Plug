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

import useModal from "@/hooks/useModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { supabase } from "../../../lib/supabase";

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
  const titleModal = useModal();
  const TitleModal = Modal;

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
    if (!userData.profileName && !userData.profileImage) {
      showToast("수정할 항목이 없습니다.");
      return;
    }

    const updates: any = {
      profile_name: userData.profileName,
    };

    // 이미지가 새로 업로드된 경우에만 처리
    if (userData.profileImage instanceof File) {
      const fileExt = userData.profileImage.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `profile/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, userData.profileImage);

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

    // ✅ 상태 업데이트
    setUserData((prev) => ({
      ...prev,
      profileName: updates.profile_name ?? prev.profileName,
      profileImage: updates.profile_pic ?? prev.profileImage,
    }));

    // ✅ 로컬스토리지의 auth-storage 갱신
    const tokenString = localStorage.getItem("auth-storage");
    if (tokenString) {
      try {
        const parsed = JSON.parse(tokenString);
        if (updates.profile_name)
          parsed.state.user.profile_name = updates.profile_name;
        if (updates.profile_pic)
          parsed.state.user.profile_pic = updates.profile_pic;
        localStorage.setItem("auth-storage", JSON.stringify(parsed));
      } catch (e) {
        console.error("로컬스토리지 갱신 실패", e);
      }
    }

    showToast("프로필이 성공적으로 수정되었습니다!");
  };

  return (
    <div>
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
      <div onClick={titleModal.open}>
        <InputField
          name="password"
          type="password"
          value={"************"}
          onChangeAction={() => {}}
          showButton={true}
          buttonContent={
            <IconBtn icon="edit" size="xs" customClassName="verify" />
          }
        />
      </div>
      <InputField
        name="profile_name"
        type="text"
        value={userData.profileName}
        onChangeAction={(e) =>
          setUserData((prev) => ({ ...prev, profileName: e.target.value }))
        }
        showButton={true}
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
      <RoundBtn text="로그아웃" size="lg" color="accent" onClick={logout} />
      <AnimatePresence mode="wait">
        {titleModal.isOpen && (
          <TitleModal
            isOpen={titleModal.isOpen}
            onClose={titleModal.close}
            buttonTitle="비밀번호 변경하기"
            onAction={() => {
              alert("확인 버튼 클릭");
              titleModal.close();
            }}
            size="lg"
            title="비밀번호 변경"
          >
            <p>현재 비밀번호</p>
            <PasswordInput setPass={setPassword} />
            <p>새 비밀번호</p>
            <PasswordInput setPass={setNewPassword} />
            <p>새 비밀번호 확인</p>
            <PasswordInput setPass={setPassCheck} />
          </TitleModal>
        )}
      </AnimatePresence>
    </div>
  );
}
