"use client";

import Link from "next/link";
import React from "react";
import styles from "./RootAside.module.scss";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { usePlaylistStore } from "@/store/usePlaylistStore";
import { useRouter } from "next/navigation";

export default function RootAside() {
  const { logout } = useAuth();
  const { resetPlaylists } = usePlaylistStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  return (
    <aside className={styles.root_aside}>
      <h1>
        <Link href="/">PLUG</Link>
      </h1>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/" className={`${styles.icon} ${styles.home}`}></Link>
          </li>
          <li>
            <Link
              href="/search"
              className={`${styles.icon} ${styles.search}`}
            ></Link>
          </li>
          <li>
            <Link
              href={isAuthenticated ? "/playlist" : "/login"}
              className={`${styles.icon} ${styles.playlist}`}
            ></Link>
          </li>
          <li>
            <Link
              href={isAuthenticated ? "/mypage" : "/login"}
              className={`${styles.icon} ${styles.user}`}
            ></Link>
          </li>
        </ul>
        <div className={styles.logout_button}>
          {isAuthenticated && (
            <button
              className={`${styles.icon} ${styles.logout}`}
              onClick={() => {
                logout();
                resetPlaylists();
                router.push("/login");
              }}
            />
          )}
        </div>
      </nav>
    </aside>
  );
}
