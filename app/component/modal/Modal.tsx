"use client";

import { ReactNode, useEffect, useState } from "react";
import styles from "./Modal.module.scss";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import Portal from "../Portal";
import { motion } from "motion/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  title?: string;
  buttonTitle?: string;
  size: "sm" | "lg";
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  onAction,
  size,
  title,
  buttonTitle,

  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Esc키 닫기
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // 마운트되었는지, 모달 열려있는지 확인
  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className={styles.modal_dim} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`${styles.modal_wrapper} ${styles[`${size}`]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader title={title} size={size} onClick={onClose} />
        <div
          className={`${styles.modal_content} ${
            size === "sm" ? styles.algin_center : ""
          }`}
        >
          {children}
        </div>
        <ModalFooter
          buttonTitle={buttonTitle}
          onAction={onAction}
          align={size != "lg" ? "center" : "right"}
        />
      </motion.div>
    </div>
  );

  return <Portal id="modal-root" content={modalContent} />;
}
