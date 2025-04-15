import React from "react";
import styles from "./RoundBtn.module.scss";

interface ButtonProps {
  text: string;
  type: "login" | "delete" | "list" | "home" | "auth_active" | "auth_disabled"; // 버튼 타입
  padding?: string; // padding 값을 동적으로 전달받음 (선택적)
  onClick?: () => void; // 클릭 이벤트 핸들러 (선택적)
}

export function RoundBtn({ text, type, padding, onClick }: ButtonProps) {
  // SCSS 클래스 이름 동적으로 설정
  const className = `${styles.round_btn} ${styles[`${type}_round_btn`]}`;

  return (
    <button
      type="button"
      className={className}
      style={{ padding }} // 전달받은 padding 값을 인라인 스타일로 적용
      onClick={onClick}
    >
      {text}
    </button>
  );
}