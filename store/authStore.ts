import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

// 인증 상태를 위한 인터페이스 정의
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id?: string;
    email?: string;
    profile_pic?: string;
    profile_name?: string;
  } | null;

  // 로그인 액션
  login: (token: string, userData: any) => void;

  // 로그아웃 액션
  logout: () => void;

  // 토큰 설정 액션
  setToken: (token: string) => void;
}

// persist 미들웨어를 사용하여 인증 상태를 로컬 스토리지에 저장하는 store 생성
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        token: null,
        user: null,

        login: (token, userData) => {
          set(
            {
              isAuthenticated: true,
              token,
              user: userData,
            },
            false,
            "auth/login" // ✅ 액션 이름
          );
        },

        logout: () => {
          set(
            {
              isAuthenticated: false,
              token: null,
              user: null,
            },
            false,
            "auth/logout"
          );
        },

        setToken: (token) => {
          set(
            {
              token,
              isAuthenticated: !!token,
            },
            false,
            "auth/setToken"
          );
        },
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          token: state.token,
          user: state.user
            ? {
                id: state.user.id,
                email: state.user.email,
                profile_pic: state.user.profile_pic,
                profile_name: state.user.profile_name,
              }
            : null,
        }),
      }
    ),
    { name: "AuthStore" } // ✅ Devtools에서 표시될 이름
  )
);
