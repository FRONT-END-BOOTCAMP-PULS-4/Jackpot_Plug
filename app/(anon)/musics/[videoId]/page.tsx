"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import VideoExtractor from "../../components/VideoExtractor";

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

  useEffect(() => {
    const cached = sessionStorage.getItem(videoId);

    if (cached) {
      setData(JSON.parse(cached));
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
      <VideoExtractor defaultUrl={data.videoUrl} />
      <h2>{data.title}</h2>
      <p>채널: {data.channelTitle}</p>
      <p>영상길이: {data.duration}</p>
      <img src={data.thumbnail} alt="썸네일" />

      <h3>타임라인</h3>
      <ul>
        {data.musicList.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
