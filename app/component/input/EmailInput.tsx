"use client";
import { ChangeEvent, useState } from "react";
import InputField from "./InputField";
import { MessageProps, ButtonProps } from "./types";

interface EmailInputProps extends MessageProps, ButtonProps {}

export default function EmailInput({
  errorMessage = {
    email: "이미 등록된 이메일이예요.",
    authCode: "코드가 잘못되었습니다. 다시 한번 인증해 주세요.",
  },
  successMessage = {
    authCode: "인증이 완료되었습니다.",
  },
  showButton = true,
}: EmailInputProps) {
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAuthCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 6) {
      setAuthCode(value);
    }
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
        showButton={showButton}
        buttonContent="인증"
        onButtonClick={handleAuthCodeClick}
        errorMessage={errorMessage}
        showErrorMessage={isError && !showAuthCode}
      />

      {showAuthCode && (
        <InputField
          id="auth_code_input"
          name="authCode"
          type="text"
          value={authCode}
          placeholder="인증번호 6자리를 입력해주세요."
          label="인증번호"
          onChangeAction={handleAuthCodeChange}
          showButton={showButton}
          buttonContent="확인"
          onButtonClick={handleConfirmClick}
          errorMessage={errorMessage}
          successMessage={successMessage}
          showErrorMessage={isError}
          showSuccessMessage={isSuccess}
        />
      )}
    </>
  );
}
