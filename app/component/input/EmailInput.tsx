"use client";
import { ChangeEvent, useState } from "react";
import InputField from "./InputField";
import { MessageProps, ButtonProps } from "./types";
import { RoundBtn } from "../button/Buttons";

interface EmailInputProps extends MessageProps, ButtonProps {}

export default function EmailInput({
  errorMessage = {
    email: "이메일 주소를 정확히 입력해 주세요.",
    emailExists: "이미 등록된 이메일이예요.",
    authCode: "코드가 잘못되었습니다. 다시 한번 인증해 주세요.",
    authCodeIncomplete: "인증코드 6자리를 모두 입력해 주세요.",
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
  const [errorType, setErrorType] = useState<
    "email" | "emailExists" | "authCode" | "authCodeIncomplete"
  >("email");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

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
    if (!validateEmail(email)) {
      setIsError(true);
      setErrorType("email");
      setShowAuthCode(false);
    } else {
      setShowAuthCode(true);
      setIsError(false);
    }
  };

  const handleConfirmClick = () => {
    if (authCode.length !== 6) {
      setIsError(true);
      setErrorType("authCodeIncomplete");
      setIsSuccess(false);
    } else {
      if (isSuccess) {
        setIsSuccess(false);
        setIsError(true);
        setErrorType("authCode");
      } else {
        setIsSuccess(true);
        setIsError(false);
      }
    }
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
        buttonContent={
          <RoundBtn
            text="인증"
            size="xs"
            color="enabled"
            customClassName="verify"
            onClick={handleAuthCodeClick}
          />
        }
        onButtonClick={handleAuthCodeClick}
        errorMessage={
          errorType === "email"
            ? { email: errorMessage.email }
            : { email: errorMessage.emailExists }
        }
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
          buttonContent={
            <RoundBtn
              text="확인"
              size="xs"
              color="enabled"
              customClassName="verify"
              onClick={handleConfirmClick}
            />
          }
          onButtonClick={handleConfirmClick}
          errorMessage={
            errorType === "authCodeIncomplete"
              ? { authCode: errorMessage.authCodeIncomplete }
              : { authCode: errorMessage.authCode }
          }
          successMessage={successMessage}
          showErrorMessage={isError}
          showSuccessMessage={isSuccess}
        />
      )}
    </>
  );
}
