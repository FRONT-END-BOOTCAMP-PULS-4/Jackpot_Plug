import Modal from "../../../components/modal/Modal";
import { useToast } from "@/hooks/useToast";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onDeleteSuccess: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  userId,
  onDeleteSuccess,
}: DeleteAccountModalProps) {
  const { showToast } = useToast();

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "회원 탈퇴 실패");
      }

      // 탈퇴 후 로그아웃 및 페이지 리다이렉트
      onDeleteSuccess();
    } catch (error: any) {
      showToast(error.message || "회원 탈퇴에 실패했습니다.", 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      buttonTitle="네, 탈퇴할게요."
      onAction={handleDeleteAccount}
      size="sm"
    >
      <p>정말로 탈퇴하시겠습니까?😢</p>
    </Modal>
  );
}