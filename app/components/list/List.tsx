"use client";
import React from "react";
import styles from "./List.module.scss";
import ListItem from "./ListItem";
import RecoListItem from "./RecoListItem";
// props로 추후 페이지에서 받아온 데이터를 전달 받을 예정입니다.
// dto가 지정되면 해당 인터페이스에 맞게 가져와야해서 틀만 현재 제공됩니다.
export default function List() {
  return (
    <ul className={styles.playlist_container}>
      {/* map 함수 돌리기 */}
      {/* mode를 바꾸셔서 기타 형태의 리스트 아이템으로 변환할 수 있습니다. */}
      <ListItem mode="edit" />
      <ListItem mode="edit" />
      <ListItem mode="edit" />
      <ListItem mode="edit" />
    </ul>
  );
}
