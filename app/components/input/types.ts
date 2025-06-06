import { ReactNode, ChangeEvent } from "react";

export interface MessageProps {
  errorMessage?: {
    email?: string;
    emailExists?: string;
    authCode?: string;
    password?: string;
    authCodeIncomplete?: string;
  };
  successMessage?: {
    authCode?: string;
  };
  showErrorMessage?: boolean;
  showSuccessMessage?: boolean;
}

export interface ButtonProps {
  showButton?: boolean;
  buttonContent?: ReactNode;
}

export interface PlaceholderProps {
  placeholder?: string;
}

export interface LabelProps {
  id?: string;
  label?: string;
  labelHidden?: boolean;
}

export interface InputBaseProps {
  name: string;
  type: string;
  value: string;
  className?: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onClick?: () => void;
}

export interface InputFieldProps
  extends InputBaseProps,
    MessageProps,
    ButtonProps,
    PlaceholderProps,
    LabelProps {}

export interface SearchInputProps {
  value?: string;
  placeholder?: string;
  buttonIcon?: ReactNode;
  size?: "default" | "small";
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  animated?: boolean;
}
