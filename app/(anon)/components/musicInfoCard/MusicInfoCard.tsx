import styles from "./MusicInfoCard.module.scss";
import Image from "next/image";

interface MusicInfoCardProps {
  thumbnailSrc: string;
  title: string;
  channelTitle: string;
  duration: string;
  type?: "playlist" | "music";
}

export default function MusicInfoCard({
  thumbnailSrc,
  title,
  channelTitle,
  duration,
  type = "music",
}: MusicInfoCardProps) {
  return (
    <div className={`${styles.container} ${styles[type]}`}>
      <Image
        src={thumbnailSrc}
        alt={`${title} thumbnail`}
        className={styles.thumnail_img}
        width={type === "playlist" ? 537 : 730}
        height={type === "playlist" ? 537 : 660}
      />
      <div className={styles.info_container}>
        <div className={styles.title}>{title}</div>

        <p className={styles.channel_title}>{channelTitle}</p>
        <p className={styles.duration}>{duration}</p>
      </div>
    </div>
  );
}
