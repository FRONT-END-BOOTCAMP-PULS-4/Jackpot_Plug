import { ReactNode, ChangeEvent } from "react";

export interface MessageProps {
  errorMessage?: {
    email?: string;
    authCode?: string;
    password?: string;
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
  onButtonClick?: () => void;
}

export interface PlaceholderProps {
  placeholder?: string;
}

export interface LabelProps {
  label?: string;
  labeHidden?: boolean;
}

export interface InputBaseProps {
  id: string;
  name: string;
  type: string;
  value: string;
  className?: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface InputFieldProps
  extends InputBaseProps,
    MessageProps,
    ButtonProps,
    PlaceholderProps,
    LabelProps {}

export interface SearchInputProps {
  placeholder?: string;
  buttonIcon?: ReactNode;
  size?: "default" | "small";
}
