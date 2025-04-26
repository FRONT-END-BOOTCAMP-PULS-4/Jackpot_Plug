import { UserData } from "../page";

export const parseJwt = (token: string) => {
  try {
    if (!token || typeof token !== "string" || !token.includes(".")) {
      throw new Error("유효하지 않은 토큰 형식");
    }
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.error("토큰 파싱 오류:", e);
    return null;
  }
};

export const getInitialAuthState = (): UserData => {
  const tokenString = localStorage.getItem("auth-storage");
  if (!tokenString)
    return { id: "", email: "", profileName: "", profileImage: null };

  try {
    const parsed = JSON.parse(tokenString);
    const jwt = parsed?.state?.token;
    const user = parsed?.state?.user;
    const payload = jwt && jwt.includes(".") ? parseJwt(jwt) : null;

    return {
      id: user?.id ?? payload?.id ?? "",
      email: user?.email ?? payload?.email ?? "",
      profileName: user?.profile_name ?? "",
      profileImage: user?.profile_pic ?? null,
    };
  } catch (e) {
    console.error("auth-storage 파싱 실패", e);
    return { id: "", email: "", profileName: "", profileImage: null };
  }
};