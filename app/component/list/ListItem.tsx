"use client";
import React, { useCallback, useState } from "react";
import styles from "./ListItem.module.scss";
import { listItemModeSwitcher } from "@/utils/modeSwitcher";
import Image from "next/image";

export interface IListItemProps {
  title?: string;
  artist?: string;
  mode?: string;
}

export default function ListItem({ title, artist, mode }: IListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setIsExpanded((current) => !current);
  }, []);

  return (
    <li className={styles[listItemModeSwitcher(mode as string) as string]}>
      <div className={styles.inner_container}>
        <div className={styles.container_leftside}>
          <Image
            className={styles.album_img}
            src={"/images/sample-image.png"}
            alt="album_img"
            width={72}
            height={72}
          />
          <p className={styles.desc_container}>
            {/* title없다면 기본값 설정하시면 됩니다. */}
            <span className={styles.title}>{title ?? "Meaning of you"}</span>
            <span className={styles.artist}>{artist ?? "아이유 IU"}</span>
          </p>
        </div>
        <div className={styles.container_rightside}>
          <button
            className={
              styles[!isExpanded ? "expand_button" : "collapse_button"]
            }
            onClick={handleExpand}
          ></button>
        </div>
      </div>
    </li>
  );
}
