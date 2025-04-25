"use client";
import styles from "./PlaylistItem.module.scss";
import Image from "next/image";
import { IconBtn } from "../button/Buttons";

interface PlaylistItemProps {
  title: string;
  src?: string;
  onClick?: () => void;
}

export default function PlaylistItem({
  title,
  onClick,
  src = "/images/sample-image.png",
}: PlaylistItemProps) {
  return (
    <li className={styles.playlist_item} onClick={onClick}>
      <div className={styles.thumbnail_container}>
        <Image
          className={styles.thumbnail_img}
          src={src}
          alt={`${title} thumbnail`}
          width={320}
          height={200}
        />
        <div className={styles.delete_btn}>
          <IconBtn icon="delete-playlist" size="xs" hoverToWhite={true} />
        </div>
      </div>
      <span className={styles.title}>{title}</span>
    </li>
  );
}
