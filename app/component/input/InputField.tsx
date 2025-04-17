"use client";
import { InputFieldProps } from "./types";
import styles from "./InputField.module.scss";

export default function InputField({
  id,
  name,
  type,
  value,
  placeholder,
  className,
  label,
  labelHidden = true,
  onChangeAction,
  onBlur,
  showButton,
  buttonContent,
  errorMessage,
  successMessage,
  showErrorMessage,
  showSuccessMessage,
}: InputFieldProps) {
  /**
   * 오류 메시지를 검색하는 함수
   * errorMessage가 객체인 경우 현재 입력 필드의 name에 해당하는 메시지를 반환
   * 문자열인 경우 해당 문자열을 반환
   */
  const getErrorMessage = () => {
    if (!errorMessage) return null;

    return typeof errorMessage === "object"
      ? errorMessage[name as keyof typeof errorMessage]
      : errorMessage;
  };

  const getSuccessMessage = () => {
    if (!successMessage) return null;

    return typeof successMessage === "object"
      ? successMessage[name as keyof typeof successMessage]
      : successMessage;
  };

  return (
    <div className={styles.input_container}>
      <div className={`${styles.input_field} ${className}`}>
        <label
          htmlFor={id}
          className={labelHidden ? "blind" : styles.visible_label}
        >
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={id}
          value={value}
          placeholder={placeholder}
          className={`${styles.input} ${value.length > 0 ? styles.filled : ""}`}
          onChange={onChangeAction}
          onBlur={onBlur}
          autoComplete="off"
        />
        {showButton && buttonContent}
      </div>

      {showErrorMessage && getErrorMessage && (
        <p className={styles.error_message}>* {getErrorMessage()}</p>
      )}

      {showSuccessMessage && getSuccessMessage && (
        <p className={styles.success_message}>* {getSuccessMessage()}</p>
      )}
    </div>
  );
}
