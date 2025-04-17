"use client";
import { createPortal } from "react-dom";

interface PortalProps {
  id: string;
  content: React.ReactNode;
}

export default function Portal({ id, content }: PortalProps) {
  // 포탈이 있는지 확인
  const portalDiv = document.getElementById(id);
  if (!portalDiv) return null;

  return createPortal(content, portalDiv);
}
