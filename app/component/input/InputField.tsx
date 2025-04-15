"use client";
import { ChangeEvent, ReactNode } from "react";
import styles from "./InputField.module.scss";

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  value: string;
  placeholder?: string;
  className?: string;
  label: string;
  labeHidden?: boolean;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
  showButton?: boolean;
  buttonContent?: ReactNode;
  onButtonClick?: () => void;
  errorMessage?: string;
  successMessage?: string;
  showErrorMessage?: boolean;
  showSuccessMessage?: boolean;
}

export default function InputField({
  id,
  name,
  type,
  value,
  placeholder,
  className,
  label,
  labeHidden = true,
  onChangeAction,
  showButton,
  buttonContent,
  onButtonClick,
  errorMessage,
  successMessage,
  showErrorMessage,
  showSuccessMessage,
}: InputFieldProps) {
  return (
    <div className={styles.input_container}>
      <div className={`${styles.input_field} ${className}`}>
        <label
          htmlFor={id}
          className={labeHidden ? "blind" : styles.visible_label}
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
          autoComplete="off"
        />
        {showButton && onButtonClick && (
          <button
            type="button"
            className={styles.verify_btn}
            onClick={onButtonClick}
          >
            {buttonContent}
          </button>
        )}
      </div>

      {showErrorMessage && errorMessage && (
        <p className={styles.error_message}>* {errorMessage}</p>
      )}

      {showSuccessMessage && successMessage && (
        <p className={styles.success_message}>* {successMessage}</p>
      )}
    </div>
  );
}
