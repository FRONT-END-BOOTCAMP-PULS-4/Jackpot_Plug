import { ISpotifyRecoData } from "@/app/api/reco/route";
import axios from "axios";

export const getBasicTopTracks = async (): Promise<ISpotifyRecoData[]> => {
  const response = await axios.get("/api/reco");
  const data = await response.data;
  return data;
};
