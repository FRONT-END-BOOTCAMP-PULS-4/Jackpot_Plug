"use client";

import { getVideoId } from "@/utils/getYoutubeId";
import { IconBtn } from "../components/button/Buttons";
import SearchInput from "../components/input/SearchInput";
import Title from "./components/title/Title";

import styles from "./page.module.scss";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { NextResponse } from "next/server";
import useModal from "@/hooks/useModal";
import RouteModal from "./components/modal/RouteModal";
import { useRouter } from "next/navigation";

export default function Home() {
  const isLogin = false; // 로그인 상태 확인
  const { showToast } = useToast();
  const routeModal = useModal();
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState(""); // 유튜브 영상 URL
  const [modalMessage, setModalMessage] = useState("모달 메세지"); // 모달 메시지

  // 유튜브 영상 설명 추출 함수
  // 영상 URL에서 ID를 추출하고, 해당 ID로 API 요청을 보내 설명을 가져옴
  const handleExtract = async () => {
    const videoId = getVideoId({ url: videoUrl, showToast });
    if (!videoId) return;

    try {
      const response = await fetch(`/api/musics?id=${videoId}`);
      if (!response.ok) {
        throw NextResponse.json(
          { error: "Failed to fetch video description" },
          { status: response.status }
        );
      }
      const data = await response.json();

      if (data.error) {
        setModalMessage(data.error);
        routeModal.open();
      }

      sessionStorage.setItem(videoId, JSON.stringify(data));
      router.push(`/musics/${videoId}`);
    } catch (error) {
      console.error("Error fetching video description:", error);
    }
  };

  return (
    <section className={styles.section_container}>
      <Title
        titleText="추천을 넘어, 연결로."
        descriptionText={`우리는 단순히 음악을 고르지 않습니다. 당신의 순간과 감정, 그리고 하루의 분위기를 이해합니다.
        당신과 음악 사이, 그 미묘한 연결을 만들기 위해. 이제, 듣는 것을 넘어서 느껴보세요.

        음악. 이제 경험의 영역입니다.`}
      ></Title>
      <SearchInput
        placeholder="추출하고 싶은 플레이리스트 링크를 입력하세요."
        onChange={(e) => setVideoUrl(e.target.value)}
        buttonIcon={<IconBtn icon="plug" size="xl" onClick={handleExtract} />}
      />
      <div>
        {isLogin ? (
          "ai 추천을 해줄거에요"
        ) : (
          <Link className={styles.go_login_text} href="/login">
            Ai 추천은 로그인이 필요해요. ✨
          </Link>
        )}
      </div>
      <RouteModal
        isOpen={routeModal.isOpen}
        onClose={routeModal.close}
        buttonText="네, 검색하러 갈게요."
        targetRoute="/search"
        message={modalMessage}
      />
    </section>
  );
}
