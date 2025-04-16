"use client";

import styles from "./ModalHeader.module.scss";
import { IconBtn } from "../button/Buttons";

interface ModalHeaderProps {
  title?: string;
  size: "sm" | "lg";
  onClick: () => void;
}

export default function ModalHeader({
  title,
  size,
  onClick,
}: ModalHeaderProps) {
  return (
    <div className={`${styles.modal_header} ${title ? styles.has_title : ""}`}>
      {title && <div className="title">{title}</div>}
      <IconBtn icon="close" size={size} onClick={onClick} />
    </div>
  );
}
