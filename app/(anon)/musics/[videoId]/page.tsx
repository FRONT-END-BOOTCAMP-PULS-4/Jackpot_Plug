"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import VideoExtractor from "../../components/VideoExtractor";
import MusicInfoCard from "../../components/musicInfoCard/MusicInfoCard";
import ListItem from "@/app/components/list/ListItem";
import { RoundBtn } from "@/app/components/button/Buttons";
import RouteModal from "@/app/components/modal/RouteModal";
import { useVideoExtract } from "@/hooks/useVideoExtract";

interface VideoData {
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
  musicList: string[];
  videoUrl: string;
}

export default function MusicPage() {
  const { videoId } = useParams() as { videoId: string };
  const [data, setData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const { extract, routeModal, modalMessage } = useVideoExtract();

  useEffect(() => {
    const cached = sessionStorage.getItem(videoId);

    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
    } else {
      extract({
        videoId,
        onSuccess: (data) => {
          setData(data);
          setLoading(false);
        },
      });
    }
  }, [videoId]);

  return (
    <>
      {loading ? (
        <p>로딩 중...</p>
      ) : !data ? (
        <p>데이터 없음</p>
      ) : (
        <div>
          <VideoExtractor defaultUrl={data.videoUrl} size="small" />
          <div className={styles.container}>
            <MusicInfoCard
              thumbnailSrc={data.thumbnail}
              title={data.title}
              channelTitle={data.channelTitle}
              duration={data.duration}
            />
            <div className={styles.musiclist_container}>
              <ul className={styles.musiclist}>
                {data.musicList.map((music, index) => (
                  <ListItem
                    mode="extract"
                    title={music}
                    key={index}
                    isLogin={isLogin}
                  />
                ))}
              </ul>
              <div className={styles.button_container}>
                {!isLogin && (
                  <div className={styles.animation}>
                    로그인 하면 사용할 수 있어요! 👉
                  </div>
                )}
                <RoundBtn
                  text="플레이리스트 만들기"
                  size="md"
                  color="accent"
                  customClassName={!isLogin ? "disabled" : ""}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <RouteModal
        isOpen={routeModal.isOpen}
        onClose={routeModal.close}
        buttonText="네, 검색하러 갈게요."
        targetRoute="/search"
        message={modalMessage}
      />
    </>
  );
}
