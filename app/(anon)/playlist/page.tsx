"use client";
import VideoListItem from "@/app/components/list/PlaylistItem";
import styles from "./page.module.scss";

export default function page() {
  return (
    <section className={styles.playlist}>
      <div className={styles.playlist_title}>
        <h2>내 플레이리스트</h2>
        <span>12</span>
      </div>
    </section>
  );
}
