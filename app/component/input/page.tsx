"use client";

import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import TextInput from "./TextInput";

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

      <PasswordInput label="현재 비밀번호" labeHidden={false} />
      <PasswordInput label="새 비밀번호" labeHidden={false} />
      <PasswordInput label="새 비밀번호 확인" labeHidden={false} />

      <TextInput
        placeholder="닉네임을 2~10자 이내로 입력해주세요."
        label="닉네임"
      />
      <TextInput
        placeholder="플레이리스트 이름을 작성해주세요."
        label="플레이리스트 이름"
      />
    </div>
  );
}
