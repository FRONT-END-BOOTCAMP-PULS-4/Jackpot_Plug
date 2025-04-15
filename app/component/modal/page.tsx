"use client";

import useModal from "@/hooks/useModal";
import Modal from "./Modal";

export default function Home() {
  const { isOpen, open, close } = useModal();
  return (
    <div>
      <button
        onClick={open}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        타이틀 없는 작은 모달 열기
      </button>

      <Modal isOpen={isOpen} onCloseAction={close} size="sm" align="center">
        <p>타이틀 없는 작은 모달</p>
        <button onClick={close}>Close</button>
      </Modal>
    </div>
  );
}
