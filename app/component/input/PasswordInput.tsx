"use client";
import { ChangeEvent, useState } from "react";
import InputField from "./InputField";
import styles from "./Password.module.scss";

export default function PasswordInput() {
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className={styles.form_container}>
      <div className={styles.password_input}>
        <label htmlFor="password_input" className="blind">
          비밀번호
        </label>
        <input
          type="password"
          name="password"
          id="password_input"
          placeholder="비밀번호를 입력해주세요."
          className={`${styles.password} ${
            password.length > 0 ? styles.filled : ""
          }`}
          onChange={handlePasswordChange}
          autoComplete="off"
          value={password}
        />
        <button type="button" className={styles.verify_btn}>
          인증
        </button>
      </div>
      {isError && (
        <p className={styles.error_message}>
          * 8~20자, 영문과 숫자를 포함하세요.
        </p>
      )}
    </div>
  );
}
