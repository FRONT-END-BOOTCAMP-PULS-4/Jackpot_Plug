import React from "react";
import styles from "./RecoList.module.scss";
import RecoListItem from "./RecoListItem";

export default function RecoList() {
  return (
    <ul className={styles.reco_list_container}>
      {/* duration은 추후 APi를 통해 받아와서 formatDuration함수를 통해 전달될 예정입니다. */}
      <RecoListItem duration="4:32"/>
      <RecoListItem duration="4:32"/>
      <RecoListItem duration="4:32"/>
      <RecoListItem duration="4:32"/>
    </ul>
  );
}
