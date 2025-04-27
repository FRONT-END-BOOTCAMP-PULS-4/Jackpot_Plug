"use client";
import styles from "./ListItem.module.scss";
import { IconBtn } from "../button/Buttons";
import Image from "next/image";
import React, { useCallback, useState } from "react";

export interface IListItemProps {
  title?: string;
  artist?: string;
  thumbnailSrc?: string;
  mode?: string;
  isSelected?: boolean;
  isLogin?: boolean;
  isPlaying?: boolean;
  onSelectToggle?: () => void;
  index?: number;
  onItemClick?: (index: number) => void;
}

export default function ListItem({
  title,
  artist,
  thumbnailSrc,
  mode,
  isSelected,
  isLogin,
  isPlaying,
  onSelectToggle,
  index,
  onItemClick,
}: IListItemProps) {
  // mode : edit, extract, playlist
  const isEdit = mode === "edit";
  const isExtractMode = mode === "extract";
  const isPlaylist = mode === "playlist";

  const [isHover, setIsHover] = useState(false);

  const handleSelect = useCallback(() => {
    onSelectToggle?.();
  }, []);

  const handlePlayPauseClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // 부모 클릭 이벤트 방지
      onSelectToggle?.();
    },
    [onSelectToggle]
  );

  const handleItemClick = useCallback(() => {
    if (typeof index === "number" && onItemClick) {
      onItemClick(index);
    }
  }, [index, onItemClick]);

  return (
    <li
      className={`${styles.item_container} ${
        isPlaylist ? styles.playlist_mode : ""
      } ${isSelected ? styles.selected : ""}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleItemClick}
    >
      <div className={styles.inner_container}>
        <div className={styles.container_leftside}>
          {isPlaylist && (
            <div className={styles.index_or_play_btn}>
              {isHover || isSelected ? (
                <IconBtn
                  icon={
                    isSelected && isPlaying ? "playlist-pause" : "playlist-play"
                  }
                  size="xxs"
                  onClick={handlePlayPauseClick}
                />
              ) : (
                <span>{typeof index === "number" ? index + 1 : ""}</span>
              )}
            </div>
          )}
          {!isExtractMode && (
            <div className={styles.album_img_wrapper}>
              <Image
                className={styles.album_img}
                src={thumbnailSrc ?? "/images/sample-image.png"}
                alt="album_img"
                width={72}
                height={72}
              />
            </div>
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
              icon={
                isExtractMode
                  ? isSelected
                    ? "minus"
                    : "add"
                  : isSelected
                  ? "add"
                  : "minus"
              }
              size="sm"
              onClick={handleSelect}
            />
          </div>
        )}
      </div>
    </li>
  );
}
