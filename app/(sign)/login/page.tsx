"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import LoginForm from "./components/LoginForm";
import styles from "../page.module.scss";

export default function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <div className={styles.div_container}>
      <LoginForm />
    </div>
  );
}