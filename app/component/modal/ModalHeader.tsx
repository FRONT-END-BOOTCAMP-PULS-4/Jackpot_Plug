"use client";

import { ReactNode } from "react";
import styles from "./modal.module.scss";

export interface ModalHeaderProps {
  onCloseAction: () => void;
  title?: string | ReactNode;
}

export default function Modal({ onCloseAction, title }: ModalHeaderProps) {
  return (
    <div className={`${styles.modal_header} ${title ? styles.has_title : ""}`}>
      {title && <div className="title">{title}</div>}
      <button className="close_button" onClick={onCloseAction}>
        x
      </button>
    </div>
  );
}
