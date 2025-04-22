"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginUseCase } from "../../../application/usecase/members/LoginUseCase";
import { LoginRequestDto } from "../../../application/usecase/members/dto/LoginRequest.dto";

import Title from "../../components/title/Title";
import EmailInput from "../../components/input/EmailInput";
import PasswordInput from "../../components/input/PasswordInput";

import { RoundBtn } from "../../components/button/Buttons";
import { useToast } from "@/hooks/useToast";

import styles from "../page.module.scss";

export default function LoginForm() {
  const [email, setEmail] = useState(""); // 사용자가 입력한 이메일
  const [password, setPassword] = useState(""); // 사용자가 입력한 비밀번호

  const router = useRouter();

  const { showToast } = useToast();

  const handleVerify = async () => {
    const loginDto: LoginRequestDto = {
      email,
      password,
    };

    const loginUseCase = new LoginUseCase();

    try {
      const result = await loginUseCase.execute(loginDto);
      showToast(result.message, 2000);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 2000);
      } else {
        showToast("알 수 없는 오류가 발생했습니다", 2000);
      }
    }
  };

  return (
    <div className={styles.div_container}>
      <Title isSmall={false} titleText="PLUG" descriptionText="" />
      <div style={{ marginBottom: '100px' }}></div>
      <EmailInput email={email} setEmail={setEmail} showButton={false} />
      <PasswordInput password={password} setPass={setPassword} />
      <RoundBtn text="로그인" size="lg" color="accent" onClick={handleVerify} />
    </div>
  );
}
