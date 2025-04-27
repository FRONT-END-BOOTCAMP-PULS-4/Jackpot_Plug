"use client";

import { useToast } from "@/hooks/useToast";
import { RoundBtn } from "../button/Buttons";

export default function ToastPage() {
  const { showToast } = useToast();
  return (
    <div>
      <RoundBtn
        text="토스트 얍!"
        size="md"
        color="gray"
        onClick={() => showToast("토스트 내용 적어요!", 2000)}
      />

      <RoundBtn
        text="에러토스트 얍!"
        size="md"
        color="gray"
        onClick={() => showToast("에러 토스트", 2000, "error")}
      />
      <RoundBtn
        text="성공 보라 토스트 얍!"
        size="md"
        color="gray"
        onClick={() => showToast("예쁜 보라색 어때요", 2000, "success")}
      />
    </div>
  );
}
