import React from "react";
import styles from "./RecoList.module.scss";
import RecoListItem from "./RecoListItem";
// props로 추후 페이지에서 받아온 데이터를 전달 받을 예정입니다.
// dto가 지정되면 해당 인터페이스에 맞게 가져와야해서 틀만 현재 제공됩니다.
export default function RecoList() {
  const sampleData = [
    {
      title: "Meaning of you",
      artist: "아이유 IU",
      duration: "4:32",
    },
    {
      title: "Meaning of you",
      artist: "아이유 IU",
      duration: "4:32",
    },
    {
      title: "Meaning of you",
      artist: "아이유 IU",
      duration: "4:32",
    },
    {
      title: "Meaning of you",
      artist: "아이유 IU",
      duration: "4:32",
    },
  ];

  return (
    <ul className={styles.reco_list_container}>
      {/* duration은 추후 APi를 통해 받아와서 formatDuration함수를 통해 전달될 예정입니다. */}
      {/* index는 추후 Map함수의 인덱스 매개변수로 전달될 예정입니다. */}
      {sampleData.map((item, index) => (
        <RecoListItem key={index} {...item} index={index}/>
      ))}
    </ul>
  );
}
