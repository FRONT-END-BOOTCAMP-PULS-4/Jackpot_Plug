"use client";

import styles from "./page.module.scss";
import Link from "next/link";
import Title from "../components/title/Title";
import VideoExtractor from "./components/VideoExtractor";
import { useAuth } from "@/hooks/useAuth";
import AIReco from "./components/aiReco";
import AIRecoSkeleton from "./components/aiRecoSkeleton";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(isAuthenticated);

  useEffect(() => {
    setIsLogin(isAuthenticated);
    setIsLoading(false);
  }, [isAuthenticated]);

  return (
    <section className={styles.section_container}>
      <Title
        titleText="추천을 넘어, 연결로."
        descriptionText={`우리는 단순히 음악을 고르지 않습니다. 당신의 순간과 감정, 그리고 하루의 분위기를 이해합니다.
        당신과 음악 사이, 그 미묘한 연결을 만들기 위해. 이제, 듣는 것을 넘어서 느껴보세요.

        음악. 이제 경험의 영역입니다.`}
      ></Title>
      <div className={styles.reco_section}>
        <VideoExtractor />
        <div className={styles.reco_list_container}>
          {isLogin ? (
            isLoading ? (
              <AIRecoSkeleton hideTitle={true} />
            ) : (
              <>
                <div className={styles.reco_header}>🪄 이런 음악은 어때요?</div>
                <AIReco hideTitle={true} />
              </>
            )
          ) : (
            <Link className={styles.go_login_text} href="/login">
              Ai 추천은 로그인이 필요해요. ✨
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
