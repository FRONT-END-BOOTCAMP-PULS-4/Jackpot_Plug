import React from "react";
import styles from "./RecoList.module.scss";
import RecoListItem from "./RecoListItem";

export default function RecoList() {
  return (
    <ul className={styles.reco_list_container}>
      <RecoListItem duration="4:32"/>
      <RecoListItem duration="4:32"/>
      <RecoListItem duration="4:32"/>
      <RecoListItem duration="4:32"/>
    </ul>
  );
}
