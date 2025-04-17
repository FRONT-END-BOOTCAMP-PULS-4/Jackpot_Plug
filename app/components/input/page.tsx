"use client";

import { IconBtn } from "../button/Buttons";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import SearchInput from "./SearchInput";
import TextInput from "./TextInput";

export default function Home() {
  return (
    <div>
      {/* 검색 폼 */}
      <form>
        <SearchInput
          placeholder="추출하고 싶은 플레이리스트 링크를 입력하세요."
          buttonIcon={<IconBtn icon="plug" size="xl" />}
        />
        {/* <SearchInput
          placeholder="추출하고 싶은 플레이리스트 링크를 입력하세요."
          size="small"
          buttonIcon={<IconBtn icon="plug" size="md" />}
        /> */}
      </form>

      {/* 로그인 폼 */}
      <form>
        <EmailInput />
        <PasswordInput />
      </form>

      {/* 비밀번호 변경 폼 */}
      <form>
        {/* <PasswordInput label="현재 비밀번호" labelHidden={false} /> */}
        <PasswordInput
          label="새 비밀번호"
          labelHidden={false}
          id="new_password"
        />
        <PasswordInput
          label="새 비밀번호 확인"
          labelHidden={false}
          id="password_confirm"
        />
      </form>

      {/* 닉네임 입력 폼 */}
      <form>
        <TextInput
          placeholder="닉네임을 2~10자 이내로 입력해주세요."
          label="닉네임"
        />
        {/* <TextInput
          placeholder="플레이리스트 제목을 작성해주세요."
          label="플레이리스트 제목"
          maxLength={20}
        /> */}
      </form>
    </div>
  );
}
