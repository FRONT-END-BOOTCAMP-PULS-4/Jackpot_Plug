import { getSpotifyAccessToken } from "@/utils/spotify";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_SPOTIFY_API_BASEURL;

// 수정: 최상위 레벨에서 await 사용 제거
export const createAxiosInstance = async () => {
  const token = await getSpotifyAccessToken();

  return axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
