"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Title from "../../../components/title/Title";
import { RoundBtn } from "../../../components/button/Buttons";
import EmailInput from "../../../components/input/EmailInput";
import PasswordInput from "../../../components/input/PasswordInput";
import ProfileForm from "./ProfileForm";
import { useToast } from "@/hooks/useToast";
import { sendVerificationEmail } from "../../utils/auth";
import styles from "../../page.module.scss";

export default function JoinForm() {
  const [email, setEmail] = useState("");
  const [checkNum, setCheckNum] = useState("");
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [passCheck, setPassCheck] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setCheckNum(code);

    const { success, message } = await sendVerificationEmail(email, code);
    showToast(message, 2000);
  };

  const handleNextClick = () => {
    if (isVerified && passCheck) {
      setShowProfileForm(true);
    } else {
      showToast("모든 항목을 입력해주세요.", 2000);
    }
  };

  if (showProfileForm) {
    return <ProfileForm email={email} password={password} />;
  }

  return (
    <>
      <Title
        isSmall={false}
        titleText="회원가입"
        descriptionText="나만의 리스트를 저장해 보세요."
      />
      <div className={styles.div_gap_110} />
      <EmailInput
        email={email}
        setEmail={setEmail}
        checkNum={checkNum}
        onClick={handleSubmit}
        setIsVerified={setIsVerified}
      />
      <PasswordInput setPass={setPassword} setPassCheck={setPassCheck} />
      <div className={styles.div_gap_46} />
      <RoundBtn
        text="다음"
        size="lg"
        color="accent"
        onClick={handleNextClick}
      />
    </>
  );
}
