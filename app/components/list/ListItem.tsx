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
  isPlaylistSelected?: boolean;
  isLogin?: boolean;
  isPlaying?: boolean;
  isCurrentlyPlaying?: boolean;
  onSelectToggle?: () => void;
  index?: number;
  onItemClick?: (index: number) => void;
  onPlayPauseClick?: () => void;
}

export default function ListItem({
  title,
  artist,
  thumbnailSrc,
  mode,
  isSelected,
  isPlaylistSelected,
  isLogin,
  isPlaying,
  isCurrentlyPlaying,
  onSelectToggle,
  index,
  onItemClick,
  onPlayPauseClick,
}: IListItemProps) {
  // mode : edit, extract, playlist
  const isEdit = mode === "edit";
  const isExtractMode = mode === "extract";
  const isPlaylistMusic = mode === "playlistMusic";

  const [isHover, setIsHover] = useState(false);

  const handleSelect = useCallback(() => {
    onSelectToggle?.();
  }, []);

  const handlePlayPauseClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onPlayPauseClick) {
        onPlayPauseClick();
      }
    },
    [onPlayPauseClick]
  );

  const handleItemClick = useCallback(() => {
    if (typeof index === "number" && onItemClick) {
      onItemClick(index);
    }
  }, [index, onItemClick]);

  return (
    <li
      className={`${styles.item_container} ${
        isPlaylistMusic ? styles.playlist_mode : ""
      } ${isCurrentlyPlaying ? styles.currently_playing : ""}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleItemClick}
    >
      <div className={styles.inner_container}>
        <div className={styles.container_leftside}>
          {isPlaylistMusic && (
            <div className={styles.index_or_play_btn}>
              {isHover || isCurrentlyPlaying || isPlaylistSelected ? (
                <IconBtn
                  icon={
                    isCurrentlyPlaying && isPlaying
                      ? "playlist-pause"
                      : "playlist-play"
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
            <span className={styles.title}>{title ?? "Title"}</span>
            {!isExtractMode && (
              <span className={styles.artist}>{artist ?? "Artist"}</span>
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
