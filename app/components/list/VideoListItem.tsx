"use client";
import styles from "./VideoListItem.module.scss";
import { IListItemProps } from "./ListItem";
import Image from "next/image";
import { videoListItemModeSwitcher } from "@/utils/modeSwitcher";
import { IconBtn } from "../button/Buttons";
import YouTube from "react-youtube";
import type { YouTubePlayer, YouTubeEvent } from "react-youtube";
import { useEffect, useRef, useState } from "react";
import { decodeHtmlEntities } from "@/utils/decodeHtmlEntities";

interface IVideoListItemProps extends IListItemProps {
  src?: string;
  duration?: string;
  isCertified?: boolean;
  onClick?: () => void;
  selected?: boolean;
  videoId?: string;
  isPlaying?: boolean;
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
  videoId,
  isPlaying = false,
}: IVideoListItemProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);

  // 유튜브 썸네일 URL 생성 함수
  const getThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  const handleThumbnailError = () => {
    setThumbnailError(true);
  };

  const handleReady = (e: YouTubeEvent) => {
    // 플레이어 인스턴스 저장
    playerRef.current = e.target;
  };

  const handleItemClick = () => {
    if (mode === "video") return;
    if (onClick) {
      onClick();
    }
  };

  const renderMedia = () => {
    if (videoId && isPlaying) {
      return (
        <YouTube
          videoId={videoId}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 1,
            },
          }}
          className={styles.video_player}
          title="YouTube video player"
          onReady={handleReady}
        />
      );
    }

    if (videoId && !thumbnailError) {
      return (
        <img
          className={styles.video_thumbnail_img}
          src={getThumbnailUrl(videoId)}
          alt={`${title} thumbnail`}
          width={240}
          height={134}
          onError={handleThumbnailError}
        />
      );
    }

    return (
      <Image
        className={styles.thumbnail_img}
        src={src}
        alt={`${title} thumbnail`}
        width={mode === "playlist" ? 380 : 240}
        height={mode === "playlist" ? 250 : 134}
      />
    );
  };

  const decodedTitle = title ? decodeHtmlEntities(title) : "Meaning of you";
  const decodedArtist = artist ? decodeHtmlEntities(artist) : "아이유 IU";

  return (
    <li
      className={`${
        styles[videoListItemModeSwitcher(mode as string) as string]
      } ${selected && mode === "thumbnail" ? styles.selected : ""}`}
      onClick={handleItemClick}
    >
      <div className={styles.thumbnail_img_container}>
        {renderMedia()}
        {mode === "playlist" && (
          <div className={styles.delete_btn_container}>
            <IconBtn icon="delete-playlist" size="sm" />
          </div>
        )}
      </div>
      <div className={styles.desc_container}>
        <span className={styles.title}>{decodedTitle}</span>
        <div className={styles.artist_container}>
          <div className={styles[isCertified ? "certified" : ""]}></div>
          <span className={styles.artist}>{decodedArtist}</span>
        </div>
        <div className={styles.add_playlist_btn}>
          <IconBtn icon="search-add-playlist" size="xs" />
        </div>
      </div>
    </li>
  );
}
