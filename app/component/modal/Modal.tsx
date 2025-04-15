"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./modal.module.scss";
import ModalHeader, { ModalHeaderProps } from "./ModalHeader";

interface ModalProps extends ModalHeaderProps {
  isOpen: boolean;
  children: ReactNode;
  size: "sm" | "lg";
  align?: "center" | "right";
}

export default function Modal({
  isOpen,
  onCloseAction,
  size,
  align = "right",
  title,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Esc키 닫기
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseAction();
    };

    document.addEventListener("keydown", handleEsc);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onCloseAction]);

  // 마운트되었는지, 모달 열려있는지 확인
  if (!mounted || !isOpen) return null;

  // 포탈이 있는지 확인
  const portalDiv = document.querySelector("#modal-root");
  if (!portalDiv) return null;

  return createPortal(
    <div className={styles.modal_dim} onClick={onCloseAction}>
      <div
        className={`${styles.modal_wrapper} ${styles[`${size}`]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader onCloseAction={onCloseAction} title={title} />
        <div className={`${styles.modal_content} ${styles[`${align}`]}`}>
          {children}
        </div>
      </div>
    </div>,
    portalDiv
  );
}
