"use client";
import styles from "./VideoListItem.module.scss";
import { IListItemProps } from "./ListItem";
import Image from "next/image";
import { videoListItemModeSwitcher } from "@/utils/modeSwitcher";
import { IconBtn } from "../button/Buttons";

interface IVideoListItemProps extends IListItemProps {
  src?: string;
  duration?: string;
  isCertified?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export default function PlaylistItem({
  title,
  onClick,
  selected,
  mode = "thumbnail",
  src = "/images/sample-image.png",
}: IVideoListItemProps) {
  return (
    <li className={styles.playlist_item} onClick={onClick}>
      <div className={styles.playlist_item_thumbnail}>
        <Image
          className={styles.thumbnail_img}
          src={src}
          alt={`${title} thumbnail`}
          width={mode === "playlist" ? 380 : 200}
          height={mode === "playlist" ? 250 : 140}
        />
        <div className={styles.delete_btn}>
          <IconBtn icon="delete-playlist" size="sm" />
        </div>
      </div>
      <div className={styles.title}>
        <span>{title ?? "Meaning of you"}</span>
      </div>
    </li>
  );
}
