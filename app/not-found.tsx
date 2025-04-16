"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not_found_layout">
      <Link className="home_round_btn" href="/">
        GO BACK HOME →
      </Link>
    </div>
  );
}
