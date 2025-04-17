"use client";
import { ChangeEvent, useState } from "react";
import InputField from "./InputField";
import { PlaceholderProps, LabelProps } from "./types";
import styles from "./InputField.module.scss";

interface TextInputPorps extends PlaceholderProps, LabelProps {
  maxLength?: number;
}

export default function TextInput({
  placeholder,
  label,
  maxLength = 10,
}: TextInputPorps) {
  const [text, setText] = useState("");

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length <= maxLength) {
      setText(value);
    }
  };

  return (
    <InputField
      id="text_input"
      name="text"
      type="text"
      value={text}
      placeholder={placeholder}
      label={label}
      onChangeAction={handleTextChange}
      className={styles.text_input}
    />
  );
}
