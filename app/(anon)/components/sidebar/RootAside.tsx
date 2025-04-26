"use client";

import Link from "next/link";
import React from "react";
import styles from "./RootAside.module.scss";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

export default function RootAside() {
  const { logout } = useAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
              href="/playlist"
              className={`${styles.icon} ${styles.playlist}`}
            ></Link>
          </li>
          <li>
            <Link
              href={isAuthenticated ? "/mypage" : "/login"}
              className={`${styles.icon} ${styles.user}`}
            ></Link>
          </li>
          <li>
            <div className={styles.logout_button}>
              {isAuthenticated && (
                <button
                  className={`${styles.icon} ${styles.logout}`}
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                />
              )}
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
