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
    </div>
  );
}
