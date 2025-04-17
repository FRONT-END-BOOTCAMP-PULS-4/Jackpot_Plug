"use client";
import React from "react";
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

export default function VideoListItem({
  title,
  artist,
  duration,
  isCertified,
  onClick,
  selected,
  mode = "thumbnail",
  src = "/images/sample-image.png",
}: IVideoListItemProps) {
  return (
    <li
      className={`${
        styles[videoListItemModeSwitcher(mode as string) as string]
      } ${selected && mode === "thumbnail" ? styles.selected : ""}`}
      onClick={mode === "video" ? undefined : onClick}
    >
      <div className={styles.thumbnail_img_container}>
        <>
          {mode === "video" ? (
            <iframe
              width="200"
              height="140"
              className={styles.video_player}
              src={src}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <Image
              className={styles.thumbnail_img}
              src={src}
              alt="album_img"
              width={mode === "playlist" ? 380 : 200}
              height={mode === "playlist" ? 250 : 140}
            />
          )}
          {mode === "playlist" && (
            <div className={styles.delete_btn_container}>
              <IconBtn icon="delete-playlist" size="sm" />
            </div>
          )}
        </>
      </div>
      <div className={styles.desc_container}>
        <span className={styles.title}>{title ?? "Meaning of you"}</span>
        <div className={styles.artist_container}>
          <div className={styles[isCertified ? "certified" : ""]}></div>
          <span className={styles.artist}>{artist ?? "아이유 IU"}</span>
        </div>
        <div className={styles.bottom_container}>
          <div className={styles.duration_container}>
            <div className={styles.duration_icon}></div>
            <span className={styles.duration}>{duration}</span>
          </div>
          <IconBtn icon="search-add-playlist" size="xxs" />
        </div>
      </div>
    </li>
  );
}
