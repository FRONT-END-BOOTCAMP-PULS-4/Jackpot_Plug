"use client";

import { useRouter } from "next/navigation";
import { LayoutProps } from "../layout";

export default function signLayout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="sign_layout">
      <div className="sign_header">
        <button onClick={() => router.back()}>
          <span>←Back</span>
        </button>
      </div>
      <main className="sign_main">{children}</main>
    </div>
  );
}
