import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_YOUTUBE_API_URL;
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  params: {
    key: apiKey,
  },
});
