// app/musics/[videoId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MusicPage() {
  const { videoId } = useParams() as { videoId: string };
  const [timeline, setTimeline] = useState<{ musicItem: string }[]>([]);

  console.log("videoId", videoId);

  useEffect(() => {
    const data = sessionStorage.getItem(videoId);
    if (data) {
      setTimeline(JSON.parse(data));
    }
  }, [videoId]);

  return (
    <div>
      <h2>타임라인</h2>
      <ul>
        {timeline.map((item, idx) => (
          <li key={idx}>{item.musicItem}</li>
        ))}
      </ul>
    </div>
  );
}
