"use client";
import styles from "./SearchInput.module.scss";
import { SearchInputProps } from "./types";

export default function SearchInput({
  placeholder,
  buttonIcon,
  size = "default",
  value,
  onChange,
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
        value={value}
        className={`${styles.search_input}`}
        autoComplete="off"
        onChange={onChange}
      />
      {buttonIcon}
    </div>
  );
}
