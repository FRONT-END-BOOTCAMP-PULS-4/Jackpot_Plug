"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";

import Title from "../../../components/title/Title";
import EmailInput from "../../../components/input/EmailInput";
import PasswordInput from "../../../components/input/PasswordInput";
import { RoundBtn } from "../../../components/button/Buttons";
import { loginUser } from "../../utils/auth";
import styles from "../../page.module.scss";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useAuth();

  const handleLogin = async () => {
    const { success, message, data } = await loginUser(email, password);

    showToast(message, 2000);

    if (success && data) {
      login(data.token, data.member);
      setTimeout(() => router.push("/"), 2000);
    }
  };

  return (
    <>
      <Title isSmall={false} titleText="PLUG" descriptionText="" />
      <EmailInput email={email} setEmail={setEmail} showButton={false} />
      <PasswordInput setPass={setPassword} />
      <div className={styles.div_gap_25} />
      <RoundBtn text="로그인" size="lg" color="accent" onClick={handleLogin} />
      <div className={styles.div_gap_46} />
      <div className={styles.div_join}>
        <p>나만의 리스트를 가지고 싶다면?&nbsp;</p>
        <button
          onClick={() => {
            router.push("/join");
          }}
          style={{ textDecoration: "underline", fontWeight: "bold" }}
        >
          회원가입
        </button>
      </div>
    </>
  );
}
