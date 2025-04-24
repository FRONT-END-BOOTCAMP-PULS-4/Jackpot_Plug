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
import { useAuthStore } from "@/store/authStore";

import { useRouter } from "next/navigation";

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
    // 인증 상태 확인
    if (!isAuthenticated) {
      router.replace("/");
      return; // 인증되지 않았으면 여기서 종료
    }

    // 사용자 데이터 로드
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
  }, [isAuthenticated, router]);

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

    try {
      const formData = new FormData();
      formData.append("userId", userData.id);

      if (isNameChanged) formData.append("profileName", newName);
      if (isImageChanged) formData.append("profileImage", newImage);

      const response = await fetch("/api/update-profile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "프로필 업데이트 실패");
      }

      setUserData((prev) => ({
        ...prev,
        profileName: data.profileName || prev.profileName,
        profileImage: data.profileImage || prev.profileImage,
      }));

      // 로컬 스토리지 업데이트
      Object.assign(parsed.state.user, {
        ...(data.profileName && { profile_name: data.profileName }),
        ...(data.profileImage && { profile_pic: data.profileImage }),
      });

      localStorage.setItem("auth-storage", JSON.stringify(parsed));
      showToast("프로필이 성공적으로 수정되었습니다!");
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      showToast("프로필 수정에 실패했습니다.");
    }
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

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.id,
          currentPassword: password,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "비밀번호 변경 실패");
      }

      setPassword("");
      setNewPassword("");
      setPassCheck("");
      titleModal.close();
      showToast("비밀번호가 성공적으로 변경되었습니다.");
    } catch (error: any) {
      alert(error.message || "비밀번호 변경에 실패했습니다.");
    }
  };

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "회원 탈퇴 실패");
      }

      // 탈퇴 후 로그아웃 및 페이지 리다이렉트
      infoModal.close();
      logout();
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "회원 탈퇴에 실패했습니다.");
    }
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
