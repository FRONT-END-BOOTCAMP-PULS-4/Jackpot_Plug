"use client";
import { ChangeEvent, useState } from "react";
import InputField from "./InputField";
import { PlaceholderProps, LabelProps } from "./types";
import styles from "./InputField.module.scss";

interface TextInputPorps extends PlaceholderProps, LabelProps {}

export default function TextInput({ placeholder, label }: TextInputPorps) {
  const [Text, setText] = useState("");

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <InputField
      id="text_input"
      name="text"
      type="text"
      value={Text}
      placeholder={placeholder}
      label={label}
      onChangeAction={handleTextChange}
      className={styles.text_input}
    />
  );
}
