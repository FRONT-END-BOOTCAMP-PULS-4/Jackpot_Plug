"use client";
import React from "react";
import styles from "./List.module.scss";
import ListItem from "./ListItem";
import RecoListItem from "./RecoListItem";

export default function List() {
  return (
    <ul className={styles.playlist_container}>
      {/* map 함수 돌리기 */}
      <ListItem mode="edit" />
      <ListItem mode="edit" />
      <ListItem mode="edit" />
      <ListItem mode="edit" />
    </ul>
  );
}
