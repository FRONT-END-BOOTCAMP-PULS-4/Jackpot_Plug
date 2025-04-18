"use client";
import { ChangeEvent, useState } from "react";
import InputField from "./InputField";
import { MessageProps, ButtonProps, LabelProps } from "./types";
import { IconBtn } from "../button/Buttons";

interface PasswordInputProps extends MessageProps, ButtonProps, LabelProps {
  password: string;
  setPass?: (email: string) => void;
  setPassCheck?: (passcheck: boolean) => void;
}

export default function PasswordInput({
  errorMessage = {
    password: "8~20자의 영문, 숫자, 특수문자(!@#$%^&*)를 사용해 주세요.",
  },
  showButton = true,
  label = "비밀번호",
  labelHidden = true,
  id = "password_input",
  setPass,
  setPassCheck,
}: PasswordInputProps) {
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // 비밀번호 유효성 검사
  const validatePassword = (password: string): boolean => {
    if (password.length === 0) return true;
    if (password.length < 8 || password.length > 20) return false;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const validChars = /^[A-Za-z0-9!@#$%^&*]*$/.test(password);

    return hasLetter && hasNumber && validChars;
  };

  /**
   * 사용자가 처음 입력을 시작한 경우 isTouched를 true로 설정
   * 사용자가 이미 필드를 건드린 상태라면 실시간으로 유효성 검사 수행
   */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPass?.(value);

    if (!isTouched && value) {
      setIsTouched(true);
    }

    if (isTouched) {
      const isValid = validatePassword(value);
      setIsError(!isValid);

      if (isValid) {
        setPassCheck?.(true);
      } else {
        setPassCheck?.(false);
      }
    }
  };

  const togglePwVisibility = () => {
    setPwVisible(!pwVisible);
  };

  /**
   * 입력 필드 포커스 상실 이벤트 핸들러
   * 1. 사용자가 필드에서 포커스를 잃었음을 표시
   * 2. 현재 입력된 비밀번호에 대해 유효성 검사 수행
   * 3. 유효성 검사 결과에 따라 에러 상태 업데이트
   * 사용자가 필드와 상호작용한 후에만 유효성 검사를 표시하여 빈 필드에 대한 불필요한 에러 메시지를 방지
   */
  const handleBlur = () => {
    setIsTouched(true);
    setIsError(!validatePassword(password));
  };

  return (
    <InputField
      id={id}
      name="password"
      type={pwVisible ? "text" : "password"}
      value={password}
      placeholder="비밀번호를 입력해주세요."
      label={label}
      labelHidden={labelHidden}
      onChangeAction={handlePasswordChange}
      showButton={showButton}
      buttonContent={
        <IconBtn
          icon={pwVisible ? "eye" : "eye-close"}
          size="xs"
          customClassName="verify"
          onClick={togglePwVisibility}
        />
      }
      errorMessage={errorMessage}
      showErrorMessage={isError}
      onBlur={handleBlur}
    />
  );
}
