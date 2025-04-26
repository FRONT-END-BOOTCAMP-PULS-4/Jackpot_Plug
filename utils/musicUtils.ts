export function toggleSelection(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

export function sortByOriginalOrder(
  originalList: string[],
  selectedList: string[]
): string[] {
  return originalList
    .map((item) => (selectedList.includes(item) ? item : null))
    .filter(Boolean) as string[];
}
