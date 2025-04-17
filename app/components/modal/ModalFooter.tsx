"use client";

import styles from "./ModalFooter.module.scss";
import { RoundBtn } from "../button/Buttons";

interface ModalFooterProps {
  align: "left" | "center" | "right";
  buttonTitle?: string;
  onAction: () => void;
}

export default function ModalFooter({
  onAction,
  align,
  buttonTitle,
}: ModalFooterProps) {
  return (
    <div className={`${styles.btn_container} ${styles[`${align}`]}`}>
      <RoundBtn
        text={buttonTitle ?? "확인"}
        size="md"
        color="accent"
        onClick={() => {
          onAction();
        }}
      />
    </div>
  );
}
