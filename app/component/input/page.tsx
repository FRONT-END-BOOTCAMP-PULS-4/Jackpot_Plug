"use client";

import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";

export default function Home() {
  return (
    <div>
      <EmailInput />
      <PasswordInput />

      <EmailInput
        errorMessage={{
          email: "이메일이 일치하지 않아요.",
        }}
        showButton={false}
      />
      <PasswordInput
        errorMessage={{
          password: "비밀번호가 일치하지 않아요.",
        }}
      />

      <PasswordInput label="새 비밀번호" labeHidden={false} />
      <PasswordInput label="새 비밀번호 확인" labeHidden={false} />
    </div>
  );
}
