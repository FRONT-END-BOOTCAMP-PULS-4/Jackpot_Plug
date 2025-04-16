"use client";

import { RoundBtn, ProfileImgBtn, IconBtn } from "./Buttons";

export default function Home() {
  return (
    <div>
      <div>
        <p>버튼 컴포넌트 테스트 페이지</p>
      </div>
      <div>
        <ProfileImgBtn />
        <ProfileImgBtn image="/assets/icons/user.svg" />
      </div>
      <div>
        <RoundBtn text="로그인" size="lg" color="accent" />
        <RoundBtn text="네, 삭제할게요." size="sm" color="accent" />
        <RoundBtn text="플레이리스트 만들기" size="md" color="accent" />
        <RoundBtn text="GO BACK HOME →" size="md" color="gray" />
        <RoundBtn text="인증" size="xs" color="enabled" />
        <RoundBtn text="인증" size="xs" color="disabled" />
      </div>
      <div>
        <IconBtn icon="close" size="lg" />
        <IconBtn icon="plug" size="xl" />
        <IconBtn icon="plug" size="md" />
        <IconBtn icon="add" size="sm" />
        <IconBtn icon="minus" size="sm" />
        <IconBtn icon="eye" size="xs" />
        <IconBtn icon="eye-close" size="xs" />
        <IconBtn icon="edit" size="xs" />
      </div>
    </div>
  );
}
