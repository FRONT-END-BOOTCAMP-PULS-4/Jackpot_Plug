export function extractTimeline(description: string) {
  const lines = description.split("\n");

  const musicItems = lines
    .filter((line) => /\d{1,2}:\d{2}(?::\d{2})?/.test(line)) // 타임스탬프 포함된 줄만
    .map((line) => {
      // 타임스탬프 제거
      const rawTitle = line
        .replace(/\(?\d{1,2}:\d{2}(?::\d{2})?\)?/, "")
        .trim();
      // 하이픈 양쪽 공백 정제
      const formattedTitle = rawTitle.replace(/\s*-\s*/, " - ");
      return { musicItem: formattedTitle };
    });

  return musicItems;
}
