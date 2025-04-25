import { useState } from "react";
import Modal from "../../../components/modal/Modal";
import PasswordInput from "../../../components/input/PasswordInput";
import { useToast } from "@/hooks/useToast";
import styles from "../page.module.scss";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function PasswordModal({
  isOpen,
  onClose,
  userId,
}: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passCheck, setPassCheck] = useState("");
  const { showToast } = useToast();

  const handlePasswordChange = async () => {
    if (!password || !newPassword || !passCheck) {
      showToast("모든 항목을 입력해주세요.", 2000);
      return;
    }

    if (newPassword !== passCheck) {
      showToast("새 비밀번호가 일치하지 않습니다.", 2000);
      return;
    }

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          currentPassword: password,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "비밀번호 변경 실패");
      }

      setPassword("");
      setNewPassword("");
      setPassCheck("");
      onClose();
      showToast("비밀번호가 성공적으로 변경되었습니다.", 2000);
    } catch (error: any) {
      showToast(error.message || "비밀번호 변경에 실패했습니다.", 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      buttonTitle="비밀번호 변경하기"
      onAction={handlePasswordChange}
      size="lg"
      title="비밀번호 변경"
    >
      <div className={styles.div_gap_25} />
      <div className={styles.div_container}>
        <p>현재 비밀번호</p>
        <PasswordInput setPass={setPassword} />
        <div className={styles.div_gap_25} />
        <p>새 비밀번호</p>
        <PasswordInput setPass={setNewPassword} />
        <div className={styles.div_gap_25} />
        <p>새 비밀번호 확인</p>
        <PasswordInput setPass={setPassCheck} />
      </div>
    </Modal>
  );
}
