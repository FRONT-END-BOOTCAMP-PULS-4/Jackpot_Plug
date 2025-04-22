export const videoListItemModeSwitcher = (mode: string) => {
  switch (mode) {
    case "video":
      return "video_item_container";
    case "thumbnail":
      return "thumbnail_item_container";
    case "playlist":
      return "playlist_item_container";
  }
};
