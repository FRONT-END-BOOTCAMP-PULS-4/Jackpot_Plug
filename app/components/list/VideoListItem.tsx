"use client";
import styles from "./VideoListItem.module.scss";
import { IListItemProps } from "./ListItem";
import Image from "next/image";
import { videoListItemModeSwitcher } from "@/utils/modeSwitcher";
import { IconBtn } from "../button/Buttons";
import YouTube from "react-youtube";
import type { YouTubePlayer, YouTubeEvent } from "react-youtube";
import { useEffect, useRef } from "react";
interface IVideoListItemProps extends IListItemProps {
  src?: string;
  duration?: string;
  isCertified?: boolean;
  onClick?: () => void;
  selected?: boolean;
  videoId?: string;
  currentPlayingId?: string | null;
  onPlay?: (videoId: string) => void;
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
  currentPlayingId,
  onPlay,
}: IVideoListItemProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);

  // YouTube URL에서 videoId 추출하는 함수
  const extractVideoId = (url: string): string | null => {
    if (!url.includes("youtube.com/embed/")) return null;

    const parts = url.split("/");
    const idPart = parts[parts.length - 1];
    // URL 파라미터 제거
    return idPart.split("?")[0];
  };

  // src가 YouTube URL인 경우 videoId 추출
  const youtubeVideoId = videoId || (src ? extractVideoId(src) : null);

  useEffect(() => {
    if (
      currentPlayingId &&
      youtubeVideoId &&
      currentPlayingId !== youtubeVideoId &&
      playerRef.current
    ) {
      // 다른 비디오가 재생 중이라면 이전 비디오 중지
      playerRef.current.pauseVideo();
    }
  }, [currentPlayingId, youtubeVideoId]);

  const handleReady = (e: YouTubeEvent) => {
    // 플레이어 인스턴스 저장
    playerRef.current = e.target;
  };

  const handlePlay = () => {
    if (onPlay && youtubeVideoId) {
      onPlay(youtubeVideoId);
    }
  };

  const renderMedia = () => {
    if (mode === "video" && youtubeVideoId) {
      return (
        <YouTube
          videoId={youtubeVideoId}
          opts={{
            width: "200",
            height: "140",
          }}
          className={styles.video_player}
          title="YouTube video player"
          onReady={handleReady}
          onPlay={handlePlay}
        />
      );
    }

    return (
      <Image
        className={styles.thumbnail_img}
        src={src}
        alt={`${title} thumbnail`}
        width={mode === "playlist" ? 380 : 200}
        height={mode === "playlist" ? 250 : 140}
      />
    );
  };

  return (
    <li
      className={`${
        styles[videoListItemModeSwitcher(mode as string) as string]
      } ${selected && mode === "thumbnail" ? styles.selected : ""}`}
      onClick={mode === "video" ? undefined : onClick}
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
