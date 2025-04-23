import axios from "axios";

export async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const authBuffer = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const res = await axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${authBuffer}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  });

  return res.data.access_token;
}
