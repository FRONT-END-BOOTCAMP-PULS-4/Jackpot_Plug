"use client";
import React from "react";
import styles from "@/app/components/list/RecoList.module.scss";
import itemStyles from "@/app/components/list/RecoListItem.module.scss";
import skeletonStyles from "./AIRecoSkeleton.module.scss";

interface AIRecoSkeletonProps {
  hideTitle?: boolean;
}

const AIRecoSkeleton: React.FC<AIRecoSkeletonProps> = ({
  hideTitle = false,
}) => {
  const skeletonItems = Array(4).fill(null);

  return (
    <div>
      {!hideTitle && (
        <h4 className={styles.reco_list_header}>AI 추천을 해드릴게요.</h4>
      )}
      <ul className={styles.reco_list_container}>
        {skeletonItems.map((_, index) => (
          <li
            key={`skeleton-${index}`}
            className={itemStyles.reco_item_container}
          >
            <div className={itemStyles.inner_container}>
              <div className={itemStyles.container_leftside}>
                <div className={skeletonStyles.icon_button} />

                <div
                  className={`${itemStyles.album_img} ${skeletonStyles.album_img}`}
                />

                <div className={itemStyles.desc_container}>
                  <div className={skeletonStyles.title} />
                  <div className={skeletonStyles.artist} />
                </div>
              </div>

              <div className={itemStyles.container_rightside}>
                <div className={skeletonStyles.duration} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIRecoSkeleton;
