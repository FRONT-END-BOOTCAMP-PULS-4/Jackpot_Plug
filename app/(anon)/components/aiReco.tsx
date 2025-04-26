"use client";
import { ISpotifyRecoData } from "@/app/api/reco/route";
import RecoList from "@/app/components/list/RecoList";
import RecoListItem from "@/app/components/list/RecoListItem";
import { getBasicTopTracks } from "@/utils/aiRecommendation";
import React, { useEffect, useState } from "react";
import AIRecoSkeleton from "./aiRecoSkeleton";

interface AIRecoProps {
  hideTitle?: boolean;
}

const AIReco: React.FC<AIRecoProps> = ({ hideTitle = false }) => {
  const [topTracks, setTopTracks] = useState<ISpotifyRecoData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getBasicTopTracks();
      setTopTracks(data);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <AIRecoSkeleton hideTitle={hideTitle} />;
  }

  return (
    <div>
      <RecoList hideTitle={hideTitle}>
        {topTracks.map((track, index) => (
          <RecoListItem
            key={`topTracks${index}`}
            {...track}
            title={track.name}
          />
        ))}
      </RecoList>
    </div>
  );
};

export default AIReco;
