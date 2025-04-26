// app\(anon)\mypage\components\ProfileInfo.tsx
import { useRef, useMemo } from "react";
import InputField from "../../../components/input/InputField";
import {
  IconBtn,
  RoundBtn,
  ProfileImgBtn,
} from "../../../components/button/Buttons";
import styles from "../page.module.scss";
import { useToast } from "@/hooks/useToast";
import { UserData } from "../page";
import axios from "axios";

interface ProfileInfoProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  openPasswordModal: () => void;
}

export default function ProfileInfo({ 
  userData, 
  setUserData,
  openPasswordModal
}: ProfileInfoProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

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
            : userData.profileImage instanceof File
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
      showToast("로그인 정보가 없습니다.", 2000);
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(tokenString);
    } catch (e) {
      console.error("로컬스토리지 파싱 실패", e);
      showToast("사용자 정보를 불러올 수 없습니다.", 2000);
      return;
    }

    const originalName = parsed.state.user.profile_name;

    const newName = userData.profileName?.trim();
    const newImage = userData.profileImage;

    if (newName && (newName.length < 2 || newName.length > 10)) {
      showToast("닉네임은 2자 이상 10자 이하로 입력해주세요.", 2000);
      return;
    }

    const isNameChanged = newName && newName !== originalName;
    const isImageChanged = newImage instanceof File;

    if (!isNameChanged && !isImageChanged) {
      showToast("수정할 항목이 없습니다.", 2000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", userData.id);

      if (isNameChanged) formData.append("profileName", newName);
      if (isImageChanged) formData.append("profileImage", newImage);

      const response = await axios.post("/api/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

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
      showToast("프로필이 성공적으로 수정되었습니다!", 2000);
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "프로필 수정에 실패했습니다.";
      console.error("프로필 업데이트 오류:", error);
      showToast(message, 2000);
    }
  };

  return (
    <>
      {memoizedProfileImgBtn}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageSelect}
      />
      <div className={styles.div_gap_25} />
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
        onClick={openPasswordModal}
        showButton={true}
        buttonContent={<IconBtn icon="edit" size="xs" customClassName="verify" />}
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
        buttonContent={<IconBtn icon="edit" size="xs" customClassName="verify" />}
      />
      <div className={styles.div_gap_25} />
      <RoundBtn
        text="변경하기"
        size="lg"
        color="accent"
        onClick={handleUpdateProfile}
      />
    </>
  );
}
