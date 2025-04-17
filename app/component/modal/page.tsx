"use client";

import useModal from "@/hooks/useModal";
import Modal from "./Modal";
import { RoundBtn } from "../button/Buttons";
import { AnimatePresence } from "motion/react";

export default function Home() {
  // 만드는 타이틀에 따라 재선언하여 사용
  // 타이틀 모달 _ 재선언
  const TitleModal = Modal;
  const titleModal = useModal();

  // info 모달 _ 재선언
  const InfoModal = Modal;
  const infoModal = useModal();

  return (
    <div>
      <RoundBtn
        text="타이틀 모달 열기"
        size="md"
        color="gray"
        onClick={titleModal.open}
      />

      <RoundBtn
        text="작은 모달 열기"
        size="md"
        color="accent"
        onClick={infoModal.open}
      />

      {/* 사라질 때 애니메이션 적용 _ AnimatePresence, titleModal.isOpen 필요 */}
      <AnimatePresence mode="wait">
        {titleModal.isOpen && (
          <TitleModal
            isOpen={titleModal.isOpen}
            onClose={titleModal.close}
            onAction={() => {
              // 버튼 클릭 시 실행 함수
              alert("확인 버튼 클릭");

              // 모달 닫기
              titleModal.close();
            }}
            size="lg"
            title="플레이리스트 확인"
          >
            <p>안에 내용 왕창 넣으세요!</p>
          </TitleModal>
        )}
      </AnimatePresence>

      {/* 사라질 때 애니메이션 미적용*/}
      <InfoModal
        isOpen={infoModal.isOpen}
        onClose={infoModal.close}
        buttonTitle="확인하고 눌러주세요."
        onAction={() => {
          alert("확인 버튼 클릭");
          infoModal.close();
        }}
        size="sm"
      >
        <p>이 내용을 확인해주세요!</p>
      </InfoModal>
    </div>
  );
}
