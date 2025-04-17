import { useEffect, useState, useRef } from "react";
import { IconBtn } from "../button/Buttons";
import styles from "./Dropdown.module.scss";

export interface DropdownOption {
  id: string;
  label: string;
  onClick?: () => void;
}

export interface DropdownProps {
  options: DropdownOption[];
  align?: "left" | "right";
  className?: string;
}

export default function Dropdown({
  options,
  align = "right",
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: DropdownOption) => {
    if (option.onClick) {
      option.onClick();
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    };
  }, []);

  return (
    <div
      className={`${styles.dropdown} ${styles[`dropdown_${align}`]} ${
        className || ""
      }`}
      ref={dropdownRef}
    >
      <div className={styles.dropdown_button_wrapper}>
        <IconBtn icon="edit" size="xs" onClick={toggleDropdown} />
      </div>

      {isOpen && (
        <div className={styles.dropdown_content}>
          <ul className={styles.dropdown_options}>
            {options.map((option) => (
              <li key={option.id} className={styles.dropdown_option}>
                <button
                  onClick={() => handleOptionClick(option)}
                  className={styles.option_btn}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
