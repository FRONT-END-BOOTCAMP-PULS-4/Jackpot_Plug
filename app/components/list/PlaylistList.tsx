import React from "react";
import styles from "./PlaylistList.module.scss";
import VideoListItem from "./PlaylistItem";

export default function PlaylistList() {
  return (
    <ul className={styles.container}>
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
      <VideoListItem mode="playlist" />
    </ul>
  );
}
