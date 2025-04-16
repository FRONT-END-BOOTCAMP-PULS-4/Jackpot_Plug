"use client";
import { ChangeEvent, useState } from "react";
import InputField from "./InputField";
import { MessageProps, ButtonProps, LabelProps } from "./types";
import { IconBtn } from "../button/Buttons";

interface PasswordInputProps extends MessageProps, ButtonProps, LabelProps {}

export default function PasswordInput({
  errorMessage = { password: "8~20자, 영문과 숫자를 포함하세요." },
  showButton = true,
  label = "비밀번호",
  labeHidden = true,
  id = "password_input",
}: PasswordInputProps) {
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePwVisibility = () => {
    setPwVisible(!pwVisible);
  };

  return (
    <InputField
      id={id}
      name="password"
      type="password"
      value={password}
      placeholder="비밀번호를 입력해주세요."
      label={label}
      labeHidden={labeHidden}
      onChangeAction={handlePasswordChange}
      showButton={showButton}
      buttonContent={
        <IconBtn icon="eye-close" size="xs" customClassName="verify" />
      }
      onButtonClick={togglePwVisibility}
      errorMessage={errorMessage}
      showErrorMessage={false}
    />
  );
}
