"use client";
import { ChangeEvent, useState } from "react";
import InputField from "./InputField";

interface EailInputProps {
  errorMessage?: {
    email?: string;
    authCode?: string;
  };
  successMessage?: {
    authCode?: string;
  };
}

export default function EmailInput({
  errorMessage = {
    email: "이메일이 일치하지 않아요.",
    authCode: "코드가 잘못되었습니다. 다시 한번 인증해주세요.",
  },
  successMessage = {
    authCode: "인증이 완료되었습니다.",
  },
}: EailInputProps) {
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAuthCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthCode(e.target.value);
  };

  const handleAuthCodeClick = () => {
    setShowAuthCode(true);
    setIsError(false);
  };

  const handleConfirmClick = () => {
    setIsError(!isError);
    setIsSuccess(!isSuccess);
  };

  return (
    <>
      <InputField
        id="email_input"
        name="email"
        type="email"
        value={email}
        placeholder="이메일을 입력해주세요."
        label="이메일"
        onChangeAction={handleEmailChange}
        showButton={true}
        buttonContent="인증"
        onButtonClick={handleAuthCodeClick}
        errorMessage={errorMessage.email}
        showErrorMessage={isError && !showAuthCode}
      />

      {showAuthCode && (
        <InputField
          id="auth_code_input"
          name="authCode"
          type="text"
          value={authCode}
          placeholder="인증번호를 입력해주세요."
          label="인증번호"
          onChangeAction={handleAuthCodeChange}
          showButton={true}
          buttonContent="확인"
          onButtonClick={handleConfirmClick}
          errorMessage={errorMessage.authCode}
          successMessage={successMessage.authCode}
          showErrorMessage={isError}
          showSuccessMessage={isSuccess}
        />
      )}
    </>
  );
}
