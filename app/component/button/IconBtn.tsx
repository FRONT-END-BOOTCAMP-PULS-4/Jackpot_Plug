import React from "react";
import styles from "./IconBtn.module.scss";

interface IconBtnProps {
  type: "plug" | "plug_small" | "add" | "minus" | "eye_open" | "eye_close" | "edit"; // 아이콘 타입
}

export function IconBtn({ type }: IconBtnProps) {
  return <button type="button" className={styles[type]} />;
}