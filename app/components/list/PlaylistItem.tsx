"use client";
import styles from "./PlaylistItem.module.scss";
import Image from "next/image";
import { IconBtn } from "../button/Buttons";
import React from "react";

interface PlaylistItemProps {
  id: string;
  title: string;
  src?: string;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

export default function PlaylistItem({
  id,
  title,
  src = "/images/sample-image.png",
  onClick,
  onDelete,
}: PlaylistItemProps) {
  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <li className={styles.playlist_item} onClick={onClick}>
      <div
        className={styles.thumbnail_container}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          className={styles.thumbnail_img}
          src={src}
          alt={`${title} thumbnail`}
          width={320}
          height={200}
        />
        <div className={styles.delete_btn}>
          <IconBtn
            icon="delete-playlist"
            size="xs"
            hoverToWhite={true}
            onClick={handleDeleteClick}
          />
        </div>
      </div>
      <span className={styles.title}>{title}</span>
    </li>
  );
}
