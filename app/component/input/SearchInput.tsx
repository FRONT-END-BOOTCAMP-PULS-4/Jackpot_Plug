"use client";
import styles from "./SearchInput.module.scss";
import "./../../global.scss";
import { SearchInputProps } from "./types";

export default function SearchInput({
  placeholder,
  buttonIcon,
  size = "default",
}: SearchInputProps) {
  return (
    <div className={`${styles.search_field} ${styles[`${size}`]}`}>
      <label htmlFor="search_input" className="blind">
        검색
      </label>
      <input
        type="text"
        name="search"
        id="search_input"
        placeholder={placeholder}
        className={`${styles.search_input}`}
        autoComplete="off"
      />
      <button>{buttonIcon}</button>
    </div>
  );
}
