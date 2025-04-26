"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import JoinForm from "./components/JoinForm";

import styles from "../page.module.scss";

export default function JoinPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <section className={styles.div_container}>
      <JoinForm />
    </section>
  );
}