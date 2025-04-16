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
  labeHidden = true,
  onChangeAction,
  onBlur,
  showButton,
  buttonContent,
  onButtonClick,
  errorMessage,
  successMessage,
  showErrorMessage,
  showSuccessMessage,
}: InputFieldProps) {
  const getErrorMessage = () => {
    if (!errorMessage) return null;

    if (typeof errorMessage === "object") {
      return errorMessage[name as keyof typeof errorMessage];
    }

    return errorMessage;
  };

  const getSuccessMessage = () => {
    if (!successMessage) return null;

    if (typeof successMessage === "object") {
      return successMessage[name as keyof typeof successMessage];
    }

    return successMessage;
  };

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
          onBlur={onBlur}
          autoComplete="off"
        />
        {showButton && onButtonClick && buttonContent}
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
