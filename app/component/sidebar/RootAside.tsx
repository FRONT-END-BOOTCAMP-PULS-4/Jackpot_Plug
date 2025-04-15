"use client";

import Link from "next/link";
import React from "react";
import styles from "./RootAside.module.scss";

export default function RootAside() {
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
              href="/mypage"
              className={`${styles.icon} ${styles.user}`}
            ></Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
