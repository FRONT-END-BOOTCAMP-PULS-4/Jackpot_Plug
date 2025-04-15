"use client";
import { ChangeEvent, useState } from "react";
import InputField from "./InputField";
import { MessageProps, ButtonProps, LabelProps } from "./types";

interface PasswordInputProps extends MessageProps, ButtonProps, LabelProps {}

export default function PasswordInput({
  errorMessage = { password: "8~20자, 영문과 숫자를 포함하세요." },
  showButton = true,
  label = "비밀번호",
  labeHidden = true,
}: PasswordInputProps) {
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <InputField
      id="password_input"
      name="password"
      type="password"
      value={password}
      placeholder="비밀번호를 입력해주세요."
      label={label}
      labeHidden={labeHidden}
      onChangeAction={handlePasswordChange}
      showButton={showButton}
      errorMessage={errorMessage}
      showErrorMessage={false}
    />
  );
}
