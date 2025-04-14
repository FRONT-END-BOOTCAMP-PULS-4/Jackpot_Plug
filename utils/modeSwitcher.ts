export const listItemModeSwitcher = (mode: string) => {
  switch (mode) {
    case "edit":
      return "edit_item_container";
    case "extract":
      return "extract_item_container";
    case "playlist":
      return "playlist_item_container";
    case "songs":
      return "songs_item_container";
  }
};
