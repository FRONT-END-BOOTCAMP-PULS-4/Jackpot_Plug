"use client";
import { ChangeEvent, useState } from "react";
import styles from "./EmailInput.module.scss";

export default function EmailInput() {
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [showBtn, setShowBtn] = useState(true);
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAuthCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthCode(e.target.value);
  };

  const handleAuthCodeClick = () => {
    setShowAuthCode(true);
    setIsError(false);
  };

  const handleConfirmClick = () => {
    setIsError(!isError);
    setIsSuccess(!isSuccess);
  };

  return (
    <div className={styles.form_container}>
      <div className={styles.email_input}>
        <label htmlFor="email_input" className="blind">
          이메일
        </label>
        <input
          type="email"
          name="email"
          id="email_input"
          placeholder="이메일을 입력해주세요."
          className={`${styles.email} ${email.length > 0 ? styles.filled : ""}`}
          onChange={handleEmailChange}
          autoComplete="off"
          value={email}
        />
        {showBtn && (
          <button
            type="button"
            className={styles.verify_btn}
            onClick={handleAuthCodeClick}
          >
            인증
          </button>
        )}
      </div>
      {isError && !showAuthCode && (
        <p className={styles.error_message}>* 이메일이 일치하지 않아요.</p>
      )}

      {showAuthCode && (
        <div className={styles.auth_code_input}>
          <label htmlFor="auth_code_input" className="blind">
            인증번호
          </label>
          <input
            type="text"
            name="authCode"
            id="auth_code_input"
            placeholder="인증번호를 입력해주세요."
            className={`${styles.authCode} ${
              authCode.length > 0 ? styles.filled : ""
            }`}
            onChange={handleAuthCodeChange}
            autoComplete="off"
            value={authCode}
          />
          <button
            type="button"
            className={styles.verify_btn}
            onClick={handleConfirmClick}
          >
            확인
          </button>
        </div>
      )}
      {showAuthCode && isSuccess && (
        <p className={styles.success_message}>* 인증이 완료되었습니다.</p>
      )}
      {showAuthCode && isError && (
        <p className={styles.error_message}>
          * 코드가 잘못되었습니다. 다시 한번 인증해 주세요.
        </p>
      )}
    </div>
  );
}
