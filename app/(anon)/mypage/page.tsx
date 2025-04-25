"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import useModal from "@/hooks/useModal";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

import ProfileInfo from "./components/ProfileInfo";
import PasswordModal from "./components/PasswordModal";
import DeleteAccountModal from "./components/DeleteAccountModal";
import { getInitialAuthState } from "./utils/authUtils";

// UserData 타입을 정의하여 재사용
export interface UserData {
  id: string;
  email: string;
  profileName: string;
  profileImage: string | File | null;
}

export default function Page() {
  const [userData, setUserData] = useState<UserData>({
    id: "",
    email: "",
    profileName: "",
    profileImage: null,
  });

  const { logout } = useAuth();
  const passwordModal = useModal();
  const deleteAccountModal = useModal();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/");
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    // 사용자 데이터 로드
    const initialState = getInitialAuthState();
    setUserData(initialState);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.div_container}>
      <ProfileInfo 
        userData={userData} 
        setUserData={setUserData} 
        openPasswordModal={passwordModal.open} 
      />
      
      <button onClick={deleteAccountModal.open}>내 계정 삭제</button>
      
      <AnimatePresence mode="wait">
        {passwordModal.isOpen && (
          <PasswordModal
            isOpen={passwordModal.isOpen}
            onClose={passwordModal.close}
            userId={userData.id}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {deleteAccountModal.isOpen && (
          <DeleteAccountModal
            isOpen={deleteAccountModal.isOpen}
            onClose={deleteAccountModal.close}
            userId={userData.id}
            onDeleteSuccess={() => {
              deleteAccountModal.close();
              logout();
              window.location.reload();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}