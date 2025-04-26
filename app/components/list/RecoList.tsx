import React, { ReactNode } from "react";
import styles from "./RecoList.module.scss";

interface RecoListProps {
  children: ReactNode;
  hideTitle?: boolean;
}

export default function RecoList({
  children,
  hideTitle = false,
}: RecoListProps) {
  return (
    <>
      {!hideTitle && (
        <h4 className={styles.reco_list_header}>AI 추천을 해드릴게요.</h4>
      )}
      <ul className={styles.reco_list_container}>{children}</ul>
    </>
  );
}
