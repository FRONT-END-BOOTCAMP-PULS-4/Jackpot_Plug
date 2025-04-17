"use client";
import React from "react";
import styles from "./RecoListItem.module.scss";
import Image from "next/image";
import { IListItemProps } from "./ListItem";
import { IconBtn } from "../button/Buttons";

interface IRecoListItemProps extends IListItemProps {
  duration: string;
  index: number;
}

export default function RecoListItem({
  title,
  artist,
  duration,
  index,
}: IRecoListItemProps) {

  return (
    <li className={styles.reco_item_container} >
      <div className={styles.inner_container}>
        <div className={styles.container_leftside}>
          <IconBtn icon="reco-search-icon" size="md" />
          <Image
            className={styles.album_img}
            src={"/images/sample-image.png"}
            alt="album_img"
            width={50}
            height={50}
          />
          <p className={styles.desc_container}>
            <span className={styles.title}>{title ?? "Meaning of you"}</span>
            <span className={styles.artist}>{artist ?? "아이유 IU"}</span>
          </p>
        </div>
        <div className={styles.container_rightside}>
          <span>{duration}</span>
        </div>
      </div>
    </li>
  );
}
