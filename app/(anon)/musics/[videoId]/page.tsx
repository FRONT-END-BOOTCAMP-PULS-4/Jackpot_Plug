"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import VideoExtractor from "../../components/VideoExtractor";
import MusicInfoCard from "../../components/musicInfoCard/MusicInfoCard";
import ListItem from "@/app/components/list/ListItem";
import { RoundBtn } from "@/app/components/button/Buttons";

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
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem(videoId);

    if (cached) {
      setData(JSON.parse(cached));
      console.log("캐시된 데이터 사용");
      setLoading(false);
    } else {
      fetch(`/api/videos?id=${videoId}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.error) {
            setError(resData.error);
          } else {
            sessionStorage.setItem(videoId, JSON.stringify(resData));
            setData(resData);
          }
        })
        .catch(() => {
          setError("데이터를 불러오는 데 실패했습니다.");
        })
        .finally(() => setLoading(false));
    }
  }, [videoId]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>데이터 없음</p>;

  return (
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
  );
}
