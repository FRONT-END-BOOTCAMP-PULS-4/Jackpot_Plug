"use client";

import ProfileImgBtn from "./ProfileImgBtn";
import { RoundBtn } from "./RoundBtn";
import { IconBtn } from "./IconBtn";

export default function Home() {
  return (
    <div>
      <div>
        <p>버튼 컴포넌트 테스트 페이지</p>
      </div>
      <div>
        <ProfileImgBtn />
      </div>
      <div>
        <RoundBtn
          text="로그인"
          type="login"
          padding="20px 187.7px"
          onClick={() => console.log("로그인 클릭")}
        />
        <RoundBtn
          text="네, 삭제할게요."
          type="delete"
          padding="12.8px 23.6px"
          onClick={() => console.log("삭제 클릭")}
        />
        <RoundBtn
          text="플레이리스트 만들기"
          type="list"
          padding="17.3px 22px"
        />
        <RoundBtn text="GO BACK HOME →" type="home" padding="9.3px 25.6px" />
        <RoundBtn text="인증" type="auth_active" padding="3px 15.1px" />
        <RoundBtn text="인증" type="auth_disabled" padding="3px 15.1px" />
      </div>
      <div>
        <IconBtn type="plug" />
        <IconBtn type="plug_small" />
        <IconBtn type="add" />
        <IconBtn type="minus" />
        <IconBtn type="eye_open" />
        <IconBtn type="eye_close" />
        <IconBtn type="edit" />
      </div>
    </div>
  );
}
