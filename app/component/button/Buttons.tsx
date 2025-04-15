import React from "react";
import styles from "./Buttons.module.scss";

/* RoundBtn 컴포넌트 */
interface RoundBtnProps {
  text: string;
  size: "lg" | "md" | "sm" | "xs";
  color?: "accent" | "gray" | "enabled" | "disabled";
  onClick?: () => void;
}

export function RoundBtn({ text, size, color, onClick }: RoundBtnProps) {
  const className = `${styles.round_btn} ${styles[`round_btn_${size}`]} ${
    color ? styles[color] : ""
  }`;

  return (
    <button type="button" className={className} onClick={onClick}>
      {text}
    </button>
  );
}

/* ProfileImgBtn 컴포넌트 */
interface ProfileImgBtnProps {
  image?: string;
  onClick?: () => void;
}

export function ProfileImgBtn({ image, onClick }: ProfileImgBtnProps) {
  const className = `${styles.profileImgBtn} ${
    image ? styles.profileImgBtn_withImage : ""
  }`;

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    ></button>
  );
}

/* IconBtn 컴포넌트 */
interface IconBtnProps {
  icon: string; // 예: "plug", "add", "eye-close"
  size: "xl" | "lg" | "md" | "sm" | "xs";
  onClick?: () => void;
}

export function IconBtn({ icon, size, onClick }: IconBtnProps) {
  const isPlug = icon === "plug";

  const className = `${styles.icon_btn} ${styles[`icon_btn_${size}`]} ${
    isPlug ? styles.icon_btn_plug : ""
  }`;

  const style = !isPlug
    ? { backgroundImage: `url("/assets/icons/${icon}.svg")` }
    : undefined;

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}
