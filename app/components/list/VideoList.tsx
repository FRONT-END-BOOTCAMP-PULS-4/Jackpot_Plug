"use client";
import React, { useCallback, useState } from "react";
import styles from "./VideoList.module.scss";
import VideoListItem from "./PlaylistItem";

export default function VideoList() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);
  return (
    // 숫자는 추후 map함수의 index로 대체될 예정입니다.
    // List 컴포넌트를 사용하지않고 Swiper을 통해 구현할 예정입니다.
    <>
      <ul className={styles.container}>
        <VideoListItem
          duration="03:45"
          isCertified={true}
          onClick={() => handleClick(0)}
          selected={selectedIndex === 0}
        />
        <VideoListItem
          duration="03:45"
          isCertified={true}
          onClick={() => handleClick(1)}
          selected={selectedIndex === 1}
        />
        <VideoListItem
          duration="03:45"
          isCertified={true}
          onClick={() => handleClick(2)}
          selected={selectedIndex === 2}
        />
        <VideoListItem
          duration="03:45"
          isCertified={true}
          onClick={() => handleClick(3)}
          selected={selectedIndex === 3}
        />
      </ul>
      <ul className={styles.container}>
        <VideoListItem
          duration="03:45"
          isCertified={true}
          mode="video"
          src="https://www.youtube.com/embed/a3ICNMQW7Ok?si=Cdl4SppeZ4a4DQ-r"
        />
        <VideoListItem
          duration="03:45"
          isCertified={true}
          mode="video"
          src="https://www.youtube.com/embed/a3ICNMQW7Ok?si=Cdl4SppeZ4a4DQ-r"
        />
        <VideoListItem
          duration="03:45"
          isCertified={true}
          mode="video"
          src="https://www.youtube.com/embed/a3ICNMQW7Ok?si=Cdl4SppeZ4a4DQ-r"
        />
        <VideoListItem
          duration="03:45"
          isCertified={true}
          mode="video"
          src="https://www.youtube.com/embed/a3ICNMQW7Ok?si=Cdl4SppeZ4a4DQ-r"
        />
      </ul>
    </>
  );
}
