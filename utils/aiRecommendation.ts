import { ISpotifyRecoData } from "@/app/api/reco/route";

export const getBasicTopTracks = async (): Promise<ISpotifyRecoData[]> => {
  const response = await fetch("/api/reco");
  const data = await response.json();
  console.log(data);
  return data;
};
