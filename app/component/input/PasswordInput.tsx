"use client";
import { ChangeEvent, useState } from "react";
import InputField from "./InputField";
import { MessageProps, ButtonProps, LabelProps } from "./types";
import { IconBtn } from "../button/Buttons";

interface PasswordInputProps extends MessageProps, ButtonProps, LabelProps {}

export default function PasswordInput({
  errorMessage = {
    password: "8~20자의 영문, 숫자, 특수문자(!@#$%^&*)를 사용해 주세요.",
  },
  showButton = true,
  label = "비밀번호",
  labelHidden = true,
  id = "password_input",
}: PasswordInputProps) {
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const validatePassword = (value: string): boolean => {
    if (value.length === 0) return true;
    if (value.length < 8 || value.length > 20) return false;
    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const validChars = /^[A-Za-z0-9!@#$%^&*]*$/.test(value);

    return hasLetter && hasNumber && validChars;
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!isTouched && value) {
      setIsTouched(true);
    }

    if (isTouched) {
      setIsError(!validatePassword(value));
    }
  };

  const togglePwVisibility = () => {
    setPwVisible(!pwVisible);
  };

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
