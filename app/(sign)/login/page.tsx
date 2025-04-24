"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

import Title from "../../components/title/Title";
import EmailInput from "../../components/input/EmailInput";
import PasswordInput from "../../components/input/PasswordInput";
import { RoundBtn } from "../../components/button/Buttons";
import { useAuth } from "@/hooks/useAuth";
import styles from "../page.module.scss";
import { useAuthStore } from "@/store/authStore";

export default function LoginForm() {
  const [email, setEmail] = useState(""); // 사용자가 입력한 이메일
  const [password, setPassword] = useState(""); // 사용자가 입력한 비밀번호
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated]);

  const handleVerify = async () => {
    const loginDto = { email, password };

    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginDto),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ JWT 토큰과 사용자 정보로 상태 저장
      login(data.token, data.member);

      showToast(data.message, 2000);
      setTimeout(() => router.push("/"), 2000);
    } else {
      showToast(data.message, 2000);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className={styles.div_container}>
      <Title isSmall={false} titleText="PLUG" descriptionText="" />
      <div style={{ marginBottom: "50px" }}></div>
      <EmailInput email={email} setEmail={setEmail} showButton={false} />
      <PasswordInput setPass={setPassword} />
      <RoundBtn text="로그인" size="lg" color="accent" onClick={handleVerify} />
      <div style={{ display: "flex" }}>
        <p>나만의 리스트를 가지고 싶다면?&nbsp;</p>
        <button
          onClick={() => {
            router.replace("/join");
          }}
          style={{ textDecoration: "underline", fontWeight: "bold" }}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
