"use client";

import Dropdown, { DropdownOption } from "./Dropdown";

export default function Home() {
  const menuOptions: DropdownOption[] = [
    {
      id: "edit-title",
      label: "제목 수정",
      // onClick: () => openModal()
    },
    {
      id: "edit-list",
      label: "리스트 수정",
      // onClick: () => openModal()
    },
  ];

  return (
    <div>
      <Dropdown options={menuOptions} align="right" />
    </div>
  );
}
