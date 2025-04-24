"use client";
import styles from "./ListItem.module.scss";
import { IconBtn } from "../button/Buttons";
import Image from "next/image";
import React, { useCallback, useState } from "react";

export interface IListItemProps {
  title?: string;
  artist?: string;
  mode?: string;
  isAdd?: boolean;
  isLogin?: boolean;
  onAction?: () => void;
}

export default function ListItem({
  title,
  artist,
  mode,
  isAdd,
  isLogin,
  onAction,
}: IListItemProps) {
  // mode : edit, extract, playlist
  const isEdit = mode === "edit";
  const isExtractMode = mode === "extract";

  const handleAdd = useCallback(() => {
    onAction?.();
  }, []);

  return (
    <li className={styles.item_container}>
      <div className={styles.inner_container}>
        <div className={styles.container_leftside}>
          {!isExtractMode && (
            <Image
              className={styles.album_img}
              src={"/images/sample-image.png"}
              alt="album_img"
              width={72}
              height={72}
            />
          )}
          <p className={styles.desc_container}>
            <span className={styles.title}>{title ?? "Meaning of you"}</span>
            {!isExtractMode && (
              <span className={styles.artist}>{artist ?? "아이유 IU"}</span>
            )}
          </p>
        </div>
        {((isExtractMode && isLogin) || isEdit) && (
          <div>
            <IconBtn
              icon={isAdd ? "minus" : "add"}
              size="sm"
              onClick={handleAdd}
            />
          </div>
        )}
      </div>
    </li>
  );
}
